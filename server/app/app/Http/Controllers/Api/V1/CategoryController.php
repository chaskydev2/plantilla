<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;

use App\Http\Requests\Category\StoreCategoryRequest;
use App\Http\Requests\Category\UpdateCategoryRequest;
use App\Http\Requests\Category\AddSubcategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        // Filtrar por categorías raíz si se solicita
        if ($request->boolean('root_only')) {
            $query->whereNull('parent_id');
        }

        // Filtrar por padre específico
        if ($request->filled('parent_id')) {
            $query->where('parent_id', $request->parent_id);
        }

        // Búsqueda por nombre
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Incluir hijos si se solicita
        if ($request->boolean('with_children')) {
            $query->with('children');
        }

        // Incluir padre si se solicita
        if ($request->boolean('with_parent')) {
            $query->with('parent');
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'name');
        $sortDir = $request->get('sort_dir', 'asc');
        
        if (in_array($sortBy, ['name', 'slug', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
        }

        // Paginación o todo
        if ($request->boolean('paginate', true)) {
            $perPage = min($request->get('per_page', 15), 100);
            $categories = $query->paginate($perPage);
        } else {
            $categories = $query->get();
        }

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
            'meta' => $request->boolean('paginate', true) ? [
                'current_page' => $categories->currentPage(),
                'last_page' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ] : null,
        ]);
    }

    /**
     * Get the category tree structure.
     */
    public function tree(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')
            ->with('allChildren')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $category = Category::create($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'data' => new CategoryResource($category->load('parent')),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error creating category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['parent', 'children', 'allChildren']);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        try {
            DB::beginTransaction();

            $category->update($request->validated());

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'data' => new CategoryResource($category->fresh(['parent', 'children'])),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Verificar si tiene hijos
            if ($category->children()->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete a category that has subcategories.',
                ], 422);
            }

            // Verificar si está siendo usada por contratistas o profesiones
            $hasContractors = $category->contractors()->exists();
            $hasProfessions = $category->professions()->exists();

            if ($hasContractors || $hasProfessions) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete a category that is being used.',
                    'details' => [
                        'contractors_count' => $hasContractors ? $category->contractors()->count() : 0,
                        'professions_count' => $hasProfessions ? $category->professions()->count() : 0,
                    ],
                ], 422);
            }

            $category->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully.',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get category ancestors (parent path).
     */
    public function ancestors(Category $category): JsonResponse
    {
        $ancestors = $category->getAncestors();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($ancestors),
        ]);
    }

    /**
     * Get category descendants (all children).
     */
    public function descendants(Category $category): JsonResponse
    {
        $descendants = $category->getDescendants();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($descendants),
        ]);
    }

    /**
     * Move a category to a new parent.
     */
    public function move(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    // No puede ser padre de sí misma
                    if ($value && $value == $category->id) {
                        $fail('A category cannot be its own parent.');
                    }

                    // No puede ser padre de sus descendientes
                    if ($value) {
                        $descendants = $category->getDescendants();
                        if ($descendants->contains('id', $value)) {
                            $fail('Cannot move a category to one of its descendants.');
                        }
                    }
                },
            ],
        ]);

        try {
            DB::beginTransaction();

            $category->update([
                'parent_id' => $request->parent_id,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Category moved successfully.',
                'data' => new CategoryResource($category->fresh(['parent', 'children'])),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error moving category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get root categories only.
     */
    public function roots(): JsonResponse
    {
        $categories = Category::whereNull('parent_id')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Search categories by name.
     */
    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:1',
            'limit' => 'integer|min:1|max:50',
        ]);

        $query = $request->q;
        $limit = $request->get('limit', 10);

        $categories = Category::where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->with('parent')
            ->orderBy('name')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
            'query' => $query,
            'total_found' => $categories->count(),
        ]);
    }

    /**
     * Add subcategories to a category.
     */
    public function addSubcategories(AddSubcategoryRequest $request, Category $category): JsonResponse
    {
        try {
            DB::beginTransaction();

            $subcategoryIds = $request->validated('subcategories');
            
            $results = $category->addSubcategories($subcategoryIds);
            
            DB::commit();

            $category->load(['children']);

            return response()->json([
                'success' => true,
                'message' => "{$results['added']} subcategories added successfully.",
                'data' => [
                    'category' => new CategoryResource($category),
                    'results' => $results
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error adding subcategories.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Move a category to a different parent using the moveTo method.
     */
    public function moveTo(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) use ($category) {
                    if ($value && $value == $category->id) {
                        $fail('A category cannot be its own parent.');
                    }
                    
                    if ($value && $category->descendants()->where('id', $value)->exists()) {
                        $fail('Cannot move to a descendant.');
                    }
                },
            ],
        ]);

        try {
            DB::beginTransaction();

            $newParentId = $request->input('parent_id');
            $newParent = $newParentId ? Category::find($newParentId) : null;
            
            $result = $category->moveTo($newParent);

            DB::commit();

            if ($result) {
                $category->load(['parent', 'children']);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Category moved successfully.',
                    'data' => new CategoryResource($category)
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Could not move the category.'
                ], 400);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error moving category.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get breadcrumbs for a category.
     */
    public function breadcrumbs(Category $category): JsonResponse
    {
        try {
            $breadcrumbs = $category->getBreadcrumbs();

            return response()->json([
                'success' => true,
                'data' => $breadcrumbs->map(fn($category) => new CategoryResource($category))
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error getting breadcrumbs.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a category and optionally its children.
     */
    public function destroyWithChildren(Category $category, Request $request): JsonResponse
    {
        $request->validate([
            'delete_children' => 'boolean',
        ]);

        try {
            DB::beginTransaction();

            $deleteChildren = $request->boolean('delete_children');

            if ($deleteChildren) {
                // Usar el método deleteWithChildren del modelo
                $category->deleteWithChildren();
                $message = 'Category and its subcategories deleted successfully.';
            } else {
                // Solo eliminar la categoría, mover hijos al padre
                $children = $category->children;
                foreach ($children as $child) {
                    $child->update(['parent_id' => $category->parent_id]);
                }
                
                $category->delete();
                $message = 'Category deleted successfully. Subcategories were moved to the top level.';
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $message
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Error deleting category.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}