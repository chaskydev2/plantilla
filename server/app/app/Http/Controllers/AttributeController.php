<?php

namespace App\Http\Controllers;

use App\Http\Requests\Attribute\StoreAttributeRequest;
use App\Http\Requests\Attribute\UpdateAttributeRequest;
use App\Http\Resources\AttributeResource;
use App\Models\AttributeModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = AttributeModel::query();

        // Filtro por tipo de usuario
        if ($request->filled('required_for')) {
            $requiredFor = $request->input('required_for');
            if (in_array($requiredFor, ['contractor', 'homeowner'])) {
                $query->where(function ($q) use ($requiredFor) {
                    $q->where('required_for', $requiredFor)
                      ->orWhere('required_for', AttributeModel::REQUIRED_FOR_BOTH);
                });
            } elseif ($requiredFor === 'both') {
                $query->where('required_for', AttributeModel::REQUIRED_FOR_BOTH);
            }
        }

        // Búsqueda por nombre o descripción
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        // Ordenamiento
        $sortBy = $request->input('sort_by', 'name');
        $sortOrder = $request->input('sort_order', 'asc');
        
        if (in_array($sortBy, ['name', 'required_for', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
        }

        // Incluir conteos de relaciones si se solicita
        if ($request->boolean('with_counts')) {
            $query->withCount(['contractors', 'homeowners']);
        }

        // Incluir relaciones si se solicita
        $with = [];
        if ($request->boolean('with_contractors')) {
            $with[] = 'contractors';
        }
        if ($request->boolean('with_homeowners')) {
            $with[] = 'homeowners';
        }
        if (!empty($with)) {
            $query->with($with);
        }

        // Paginación
        $perPage = min($request->input('per_page', 15), 100);
        $attributes = $query->paginate($perPage);

        return AttributeResource::collection($attributes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttributeRequest $request): AttributeResource
    {
        $validatedData = $request->validated();
        
        // Generar slug único
        $validatedData['slug'] = Str::slug($validatedData['name']);
        
        // Asegurar que el slug sea único
        $originalSlug = $validatedData['slug'];
        $counter = 1;
        while (AttributeModel::where('slug', $validatedData['slug'])->exists()) {
            $validatedData['slug'] = $originalSlug . '-' . $counter;
            $counter++;
        }

        $attribute = AttributeModel::create($validatedData);

        return new AttributeResource($attribute);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, AttributeModel $attribute): AttributeResource
    {
        // Cargar relaciones si se solicita
        $with = [];
        if ($request->boolean('with_contractors')) {
            $with[] = 'contractors';
        }
        if ($request->boolean('with_homeowners')) {
            $with[] = 'homeowners';
        }
        if ($request->boolean('with_counts')) {
            $attribute->loadCount(['contractors', 'homeowners']);
        }
        if (!empty($with)) {
            $attribute->load($with);
        }

        return new AttributeResource($attribute);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttributeRequest $request, $attribute): AttributeResource|JsonResponse
    {
        // Buscar por slug o id manualmente para evitar errores de binding
        $attributeModel = AttributeModel::where('slug', $attribute)
            ->orWhere('id', $attribute)
            ->first();

        if (!$attributeModel) {
            return response()->json([
                'message' => 'Attribute not found',
                'error' => "Attribute not found: {$attribute}"
            ], 404);
        }

        $validatedData = $request->validated();

        // Si se actualiza el nombre, regenerar el slug
        if (isset($validatedData['name']) && $validatedData['name'] !== $attributeModel->name) {
            $newSlug = Str::slug($validatedData['name']);
            
            // Asegurar que el slug sea único
            $originalSlug = $newSlug;
            $counter = 1;
            while (AttributeModel::where('slug', $newSlug)->where('id', '!=', $attributeModel->id)->exists()) {
                $newSlug = $originalSlug . '-' . $counter;
                $counter++;
            }
            
            $validatedData['slug'] = $newSlug;
        }

        $attributeModel->update($validatedData);

        return new AttributeResource($attributeModel->fresh());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttributeModel $attribute): JsonResponse
    {
        // Verificar si el atributo está siendo usado
        $contractorsCount = $attribute->contractors()->count();
        $homeownersCount = $attribute->homeowners()->count();
        
        if ($contractorsCount > 0 || $homeownersCount > 0) {
            return response()->json([
                'message' => 'Cannot delete this attribute because it is being used.',
                'details' => [
                    'contractors_using' => $contractorsCount,
                    'homeowners_using' => $homeownersCount,
                    'total_usage' => $contractorsCount + $homeownersCount
                ]
            ], 422);
        }

        $attribute->delete();

        return response()->json([
            'message' => 'Attribute deleted successfully.'
        ]);
    }

    /**
     * Get attributes for contractors only.
     */
    public function forContractors(Request $request): AnonymousResourceCollection
    {
        $query = AttributeModel::where(function ($q) {
            $q->where('required_for', AttributeModel::REQUIRED_FOR_CONTRACTOR)
              ->orWhere('required_for', AttributeModel::REQUIRED_FOR_BOTH);
        });

        // Aplicar filtros de búsqueda si existen
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy('name');
        
        $perPage = min($request->input('per_page', 15), 100);
        $attributes = $query->paginate($perPage);

        return AttributeResource::collection($attributes);
    }

    /**
     * Get attributes for homeowners only.
     */
    public function forHomeowners(Request $request): AnonymousResourceCollection
    {
        $query = AttributeModel::where(function ($q) {
            $q->where('required_for', AttributeModel::REQUIRED_FOR_HOMEOWNER)
              ->orWhere('required_for', AttributeModel::REQUIRED_FOR_BOTH);
        });

        // Aplicar filtros de búsqueda si existen
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $query->orderBy('name');
        
        $perPage = min($request->input('per_page', 15), 100);
        $attributes = $query->paginate($perPage);

        return AttributeResource::collection($attributes);
    }

    /**
     * Get statistics about attributes usage.
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total_attributes' => AttributeModel::count(),
            'contractor_attributes' => AttributeModel::where('required_for', AttributeModel::REQUIRED_FOR_CONTRACTOR)->count(),
            'homeowner_attributes' => AttributeModel::where('required_for', AttributeModel::REQUIRED_FOR_HOMEOWNER)->count(),
            'both_attributes' => AttributeModel::where('required_for', AttributeModel::REQUIRED_FOR_BOTH)->count(),
            'most_used_attributes' => AttributeModel::withCount(['contractors', 'homeowners'])
                ->get()
                ->map(function ($attribute) {
                    $attribute->total_usage = $attribute->contractors_count + $attribute->homeowners_count;
                    return $attribute;
                })
                ->sortByDesc('total_usage')
                ->take(10)
                ->values(),
            'least_used_attributes' => AttributeModel::withCount(['contractors', 'homeowners'])
                ->get()
                ->map(function ($attribute) {
                    $attribute->total_usage = $attribute->contractors_count + $attribute->homeowners_count;
                    return $attribute;
                })
                ->sortBy('total_usage')
                ->take(10)
                ->values()
        ];

        return response()->json($stats);
    }
}