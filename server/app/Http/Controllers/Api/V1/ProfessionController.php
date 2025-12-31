<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profession\StoreProfessionRequest;
use App\Http\Requests\Profession\UpdateProfessionRequest;
use App\Http\Resources\ProfessionResource;
use App\Models\Profession;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\File;

class ProfessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Profession::query();

        // Apply search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Include counts if requested
        if ($request->boolean('with_counts')) {
            $query->withContractorsCount();
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->sort($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $professions = $query->paginate($perPage);

        return ProfessionResource::collection($professions);
    }

    /**
     * Get all professions without pagination.
     */
    public function all(Request $request): AnonymousResourceCollection
    {
        $query = Profession::query();

        // Apply search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Include counts if requested
        if ($request->boolean('with_counts')) {
            $query->withContractorsCount();
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->sort($sortBy, $sortDir);

        $professions = $query->get();

        return ProfessionResource::collection($professions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProfessionRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['image'] = $this->persistImage($request, null) ?? $data['image'] ?? null;

        $profession = Profession::create($data);

        return response()->json([
            'message' => 'Profesión creada exitosamente',
            'data' => new ProfessionResource($profession)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id): JsonResponse
    {
        try {
            // Buscar por ID o por slug
            $profession = is_numeric($id) 
                ? Profession::findOrFail($id)
                : Profession::where('slug', $id)->firstOrFail();

            // Load relationships if requested
            if ($request->boolean('with_contractors')) {
                $profession->load('contractors.user');
            }

            return response()->json([
                'message' => 'Profesión encontrada',
                'data' => new ProfessionResource($profession)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Profesión no encontrada',
                'error' => "No se encontró una profesión con el identificador: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la profesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProfessionRequest $request, $id): JsonResponse
    {
        try {
            // Buscar por ID o por slug
            $profession = is_numeric($id) 
                ? Profession::findOrFail($id)
                : Profession::where('slug', $id)->firstOrFail();

            $data = $request->validated();

            $image = $this->persistImage($request, $profession->image);
            if ($image !== '__keep') {
                $data['image'] = $image;
            } else {
                unset($data['image']);
            }

            $profession->update($data);

            return response()->json([
                'message' => 'Profesión actualizada exitosamente',
                'data' => new ProfessionResource($profession)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Profesión no encontrada',
                'error' => "No se encontró una profesión con el identificador: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la profesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            // Buscar por ID o por slug
            $profession = is_numeric($id) 
                ? Profession::findOrFail($id)
                : Profession::where('slug', $id)->firstOrFail();

            // Check if profession has associated contractors
            if ($profession->hasContractors()) {
                return response()->json([
                    'message' => 'No se puede eliminar la profesión porque tiene contratistas asociados'
                ], 422);
            }
            $this->deleteImageIfExists($profession->image);
            $profession->delete();

            return response()->json([
                'message' => 'Profesión eliminada exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Profesión no encontrada',
                'error' => "No se encontró una profesión con el identificador: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la profesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get profession by slug.
     */
    public function bySlug(Request $request, string $slug): ProfessionResource
    {
        $profession = Profession::bySlug($slug)->firstOrFail();

        // Load relationships if requested
        if ($request->boolean('with_contractors')) {
            $profession->load('contractors.user');
        }

        return new ProfessionResource($profession);
    }

    /**
     * Get profession statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_professions' => Profession::count(),
            'professions_with_contractors' => Profession::has('contractors')->count(),
            'most_popular_professions' => Profession::withCount('contractors')
                ->orderBy('contractors_count', 'desc')
                ->limit(10)
                ->get(['id', 'name', 'contractors_count']),
            'recent_professions' => Profession::latest()
                ->limit(5)
                ->get(['id', 'name', 'created_at']),
        ];

        return response()->json($stats);
    }

    /**
     * Search professions with contractors in a specific area.
     */
    public function withContractorsInArea(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'city' => 'nullable|string|max:120',
            'service_area' => 'nullable|string|max:255',
            'min_rating' => 'nullable|numeric|min:0|max:5',
        ]);

        $query = Profession::with(['contractors' => function ($query) use ($request) {
            $query->approved(); // Only approved contractors

            if ($request->filled('city')) {
                $query->byCity($request->city);
            }

            if ($request->filled('service_area')) {
                $query->byServiceArea($request->service_area);
            }

            if ($request->filled('min_rating')) {
                $query->byRating((float) $request->min_rating);
            }

            $query->with('user');
        }])->whereHas('contractors', function ($query) use ($request) {
            $query->approved();

            if ($request->filled('city')) {
                $query->byCity($request->city);
            }

            if ($request->filled('service_area')) {
                $query->byServiceArea($request->service_area);
            }

            if ($request->filled('min_rating')) {
                $query->byRating((float) $request->min_rating);
            }
        });

        // Apply sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortDir = $request->get('sort_dir', 'asc');
        $query->sort($sortBy, $sortDir);

        $professions = $query->get();

        return ProfessionResource::collection($professions);
    }

    private function persistImage(Request $request, ?string $currentPath): ?string
    {
        if ($request->boolean('remove_image')) {
            $this->deleteImageIfExists($currentPath);
            return null;
        }

        if (!$request->hasFile('image')) {
            return '__keep';
        }

        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return '__keep';
        }

        $this->deleteImageIfExists($currentPath);

        $directory = public_path('assets/professions');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('profession_image_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/professions/' . $filename;
    }

    private function deleteImageIfExists(?string $path): void
    {
        if (!$path) {
            return;
        }

        $fullPath = public_path($path);
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
    }

    /**
     * Get popular professions based on contractor count.
     */
    public function popular(Request $request): AnonymousResourceCollection
    {
        $limit = $request->get('limit', 10);

        $professions = Profession::withCount('contractors')
            ->orderBy('contractors_count', 'desc')
            ->limit($limit)
            ->get();

        return ProfessionResource::collection($professions);
    }

    /**
     * Get available profession IDs and names for debugging.
     */
    public function available(): JsonResponse
    {
        $professions = Profession::select('id', 'name', 'slug')->get();
        
        return response()->json([
            'message' => 'Profesiones disponibles',
            'count' => $professions->count(),
            'data' => $professions
        ]);
    }
}