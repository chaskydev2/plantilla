<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contractor\StoreContractorRequest;
use App\Http\Requests\Contractor\UpdateContractorRequest;
use App\Http\Resources\ContractorResource;
use App\Http\Resources\ContractorCollection;
use App\Models\Contractor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContractorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Contractor::with('user');

        // Apply filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status')) {
            $query->where('contract_status', $request->status);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        if ($request->filled('service_area')) {
            $query->byServiceArea($request->service_area);
        }

        if ($request->filled('min_rating')) {
            $query->byRating((float) $request->min_rating);
        }

        if ($request->filled('is_insured')) {
            $query->where('is_insured', $request->boolean('is_insured'));
        }

        if ($request->filled('has_driving_license')) {
            $query->where('has_driving_license', $request->boolean('has_driving_license'));
        }

        // Location-based search
        if ($request->filled('near_location')) {
            $radius = $request->filled('radius') ? (float) $request->radius : 50;
            $query->withinRadius((float) $request->lat, (float) $request->lng, $radius);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->sort($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $contractors = $query->paginate($perPage);

        return ContractorResource::collection($contractors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContractorRequest $request): JsonResponse
    {
        $contractor = Contractor::create($request->validated());
        $contractor->load('user');

        return response()->json([
            'message' => 'Contractor creado exitosamente',
            'data' => new ContractorResource($contractor)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contractor $contractor): ContractorResource
    {
        $contractor->load('user');
        return new ContractorResource($contractor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContractorRequest $request, Contractor $contractor): JsonResponse
    {
        $contractor->update($request->validated());
        $contractor->load('user');

        return response()->json([
            'message' => 'Contractor actualizado exitosamente',
            'data' => new ContractorResource($contractor)
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contractor $contractor): JsonResponse
    {
        $contractor->delete();

        return response()->json([
            'message' => 'Contractor eliminado exitosamente'
        ]);
    }

    /**
     * Approve a contractor.
     */
    public function approve(Contractor $contractor): JsonResponse
    {
        if ($contractor->approve()) {
            $contractor->load('user');
            return response()->json([
                'message' => 'Contractor aprobado exitosamente',
                'data' => new ContractorResource($contractor)
            ]);
        }

        return response()->json([
            'message' => 'Error al aprobar el contractor'
        ], 500);
    }

    /**
     * Reject a contractor.
     */
    public function reject(Contractor $contractor): JsonResponse
    {
        if ($contractor->reject()) {
            $contractor->load('user');
            return response()->json([
                'message' => 'Contractor rechazado exitosamente',
                'data' => new ContractorResource($contractor)
            ]);
        }

        return response()->json([
            'message' => 'Error al rechazar el contractor'
        ], 500);
    }

    /**
     * Suspend a contractor.
     */
    public function suspend(Contractor $contractor): JsonResponse
    {
        if ($contractor->suspend()) {
            $contractor->load('user');
            return response()->json([
                'message' => 'Contractor suspendido exitosamente',
                'data' => new ContractorResource($contractor)
            ]);
        }

        return response()->json([
            'message' => 'Error al suspender el contractor'
        ], 500);
    }

    /**
     * Get contractors by status.
     */
    public function byStatus(Request $request, string $status): AnonymousResourceCollection
    {
        $validStatuses = [
            Contractor::STATUS_PENDING,
            Contractor::STATUS_APPROVED,
            Contractor::STATUS_REJECTED,
            Contractor::STATUS_SUSPENDED
        ];

        if (!in_array($status, $validStatuses)) {
            abort(400, 'Estado no válido');
        }

        $query = Contractor::with('user')->where('contract_status', $status);

        // Apply additional filters
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        if ($request->filled('service_area')) {
            $query->byServiceArea($request->service_area);
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->sort($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $contractors = $query->paginate($perPage);

        return ContractorResource::collection($contractors);
    }

    /**
     * Get contractor statistics.
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total' => Contractor::count(),
            'approved' => Contractor::approved()->count(),
            'pending' => Contractor::pending()->count(),
            'rejected' => Contractor::rejected()->count(),
            'suspended' => Contractor::suspended()->count(),
            'insured' => Contractor::insured()->count(),
            'with_driving_license' => Contractor::withDrivingLicense()->count(),
            'average_rating' => Contractor::avg('average_rating'),
            'by_city' => Contractor::selectRaw('city, COUNT(*) as count')
                ->whereNotNull('city')
                ->groupBy('city')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
            'by_service_area' => Contractor::selectRaw('service_area, COUNT(*) as count')
                ->groupBy('service_area')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get(),
        ];

        return response()->json($stats);
    }

    /**
     * Search contractors near a location.
     */
    public function nearLocation(Request $request): AnonymousResourceCollection
    {
     
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:1|max:500',
            'service_area' => 'nullable|string',
            'min_rating' => 'nullable|numeric|min:0|max:5',
            'profession_name' => 'nullable|string',
        ]);

        $lat = (float) $validated['lat'];
        $lng = (float) $validated['lng'];
        $radius = $request->filled('radius') ? (float) $validated['radius'] : 20.0;
        $tagIds = $validated['tags'] ?? [];
        $professionIds = $validated['professions'] ?? [];
        $professionName = $validated['profession_name'] ?? null;

        $query = Contractor::with(['user', 'tags', 'professions']);

        // Filtrar por nombre de profesión si se proporciona
        if ($professionName) {
           
            $query->whereHas('professions', function ($q) use ($professionName) {
                $q->where('name', 'like', "%{$professionName}%");
            });
        }

        $contractors = $query->get();

        return ContractorResource::collection($contractors);
    }

     public function updateAllFields(Request $request, $id): JsonResponse
    {
        $contractor = Contractor::findOrFail($id);

        // Validación rápida (puedes personalizar según tus reglas)
        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'preferred_zip' => 'nullable|string|max:15',
            'address_line1' => 'nullable|string|max:200',
            'address_line2' => 'nullable|string|max:200',
            'city' => 'nullable|string|max:120',
            'company_name' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255',
            'is_insured' => 'nullable|boolean',
            'service_area' => 'nullable|string|max:255',
            'average_rating' => 'nullable|numeric|min:0|max:5',
            'state_code' => 'nullable|string|max:10',
            'country_code' => 'nullable|string|max:2',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'mobile_number' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'has_driving_license' => 'nullable|boolean',
            'driving_license_category' => 'nullable|string|max:10',
            'linkedin_url' => 'nullable|string|max:500',
            'portfolio_url' => 'nullable|string|max:500',
            'affiliation_date' => 'nullable|date',
            'approval_date' => 'nullable|date',
            'contract_status' => 'nullable|in:pendiente,aprobado,rechazado,suspendido',
        ]);

        // Solo actualizar si hay cambios
        $contractor->fill($validated);
        $dirty = $contractor->getDirty();
        if (!empty($dirty)) {
            $contractor->save();
        }

        // Cargar relaciones útiles si es necesario
        $contractor->load('user');

        return response()->json([
            'success' => true,
            'message' => empty($dirty)
                ? 'No hubo cambios para actualizar'
                : 'Contractor actualizado correctamente',
            'data' => $contractor
        ]);
    }

    public function showFullInfo($id): JsonResponse
    {
        $contractor = Contractor::with([
                'user',
                'professions',
                'attributeContractors.attribute',
        ])->findOrFail($id);

            return response()->json([
                'success' => true,
                'message' => 'Información completa del contractor obtenida correctamente',
                'data' => $contractor
            ]);
    }

    public function searchByUserName(Request $request): AnonymousResourceCollection
    {
        $request->validate([
            'name' => 'required|string|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $name = strtolower($request->name);
        $perPage = $request->input('per_page', 15);

        $contractors = Contractor::with('user')
            ->whereHas('user', function ($q) use ($name) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%' . $name . '%']);
            })
            ->paginate($perPage);

        return ContractorResource::collection($contractors);
    }
}