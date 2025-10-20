<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HomeownerProfile;
use App\Http\Requests\HomeownerProfile\StoreHomeownerProfileRequest;
use App\Http\Requests\HomeownerProfile\UpdateHomeownerProfileRequest;
use App\Http\Resources\HomeownerProfileResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class HomeownerProfileController extends Controller
{
    /**
     * Display a listing of homeowner profiles.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = HomeownerProfile::with('user');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('city', 'like', "%{$search}%")
              ->orWhere('preferred_zip', 'like', "%{$search}%");
        }

        // Filter by city
        if ($request->filled('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        // Filter by country
        if ($request->filled('country_code')) {
            $query->where('country_code', $request->country_code);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        
        if (in_array($sortBy, ['created_at', 'updated_at', 'city', 'country_code'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $homeownerProfiles = $query->paginate($perPage);

        return HomeownerProfileResource::collection($homeownerProfiles);
    }

    /**
     * Display the specified homeowner profile.
     */
    public function show($userId): JsonResponse
    {
        try {
            $homeownerProfile = HomeownerProfile::with('user')->findOrFail($userId);
            
            return response()->json([
                'message' => 'Perfil de propietario encontrado',
                'data' => new HomeownerProfileResource($homeownerProfile)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Perfil de propietario no encontrado',
                'error' => "No se encontró un perfil con el ID: {$userId}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created homeowner profile.
     */
    public function store(StoreHomeownerProfileRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            
            // Set default country code if not provided
            if (!isset($data['country_code'])) {
                $data['country_code'] = 'US';
            }
            
            $homeownerProfile = HomeownerProfile::create($data);
            $homeownerProfile->load('user');
            
            return response()->json([
                'message' => 'Perfil de propietario creado exitosamente',
                'data' => new HomeownerProfileResource($homeownerProfile)
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified homeowner profile.
     */
    public function update(UpdateHomeownerProfileRequest $request, $userId): JsonResponse
    {
        try {
            $homeownerProfile = HomeownerProfile::findOrFail($userId);
            
            $data = $request->validated();
            $homeownerProfile->update($data);
            $homeownerProfile->load('user');
            
            return response()->json([
                'message' => 'Perfil de propietario actualizado exitosamente',
                'data' => new HomeownerProfileResource($homeownerProfile)
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Perfil de propietario no encontrado',
                'error' => "No se encontró un perfil con el ID: {$userId}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified homeowner profile.
     */
    public function destroy($userId): JsonResponse
    {
        try {
            $homeownerProfile = HomeownerProfile::findOrFail($userId);
            $homeownerProfile->delete();
            
            return response()->json([
                'message' => 'Perfil de propietario eliminado exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Perfil de propietario no encontrado',
                'error' => "No se encontró un perfil con el ID: {$userId}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get homeowner profile statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_profiles' => HomeownerProfile::count(),
            'profiles_by_country' => HomeownerProfile::selectRaw('country_code, COUNT(*) as count')
                ->groupBy('country_code')
                ->get(),
            'profiles_with_address' => HomeownerProfile::whereNotNull('address_line1')->count(),
            'profiles_with_coordinates' => HomeownerProfile::whereNotNull('lat')
                ->whereNotNull('lng')
                ->count(),
            'recent_profiles' => HomeownerProfile::with('user')
                ->latest()
                ->limit(5)
                ->get(['user_id', 'city', 'country_code', 'created_at']),
        ];

        return response()->json($stats);
    }

    /**
     * Get all homeowner profiles without pagination.
     */
    public function all(Request $request): AnonymousResourceCollection
    {
        $query = HomeownerProfile::with('user');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhere('city', 'like', "%{$search}%");
        }

        // Filter by country
        if ($request->filled('country_code')) {
            $query->where('country_code', $request->country_code);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        
        if (in_array($sortBy, ['created_at', 'updated_at', 'city', 'country_code'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        $homeownerProfiles = $query->get();

        return HomeownerProfileResource::collection($homeownerProfiles);
    }
}