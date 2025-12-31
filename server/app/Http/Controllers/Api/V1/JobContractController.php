<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobContract;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobContractController extends Controller
{
    /**
     * Display a listing of job contracts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = JobContract::with(['jobPost', 'contractor']);

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        // Filter by contractor
        if ($request->filled('contractor_id')) {
            $query->where('contractor_id', $request->contractor_id);
        }
        // Filter by job post
        if ($request->filled('job_post_id')) {
            $query->where('job_post_id', $request->job_post_id);
        }
        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'start_date', 'end_date', 'status'])) {
            $query->orderBy($sortBy, $sortDir);
        }
        // Pagination
        $perPage = $request->get('per_page', 15);
        $contracts = $query->paginate($perPage);
        return response()->json($contracts);
    }

    /**
     * Display the specified job contract.
     */
    public function show($id): JsonResponse
    {
        try {
            $contract = JobContract::with(['jobPost', 'contractor'])->findOrFail($id);
            return response()->json([
                'message' => 'Contrato encontrado',
                'data' => $contract
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Contrato no encontrado',
                'error' => "No se encontró un contrato con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el contrato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created job contract.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'job_post_id' => 'required|exists:job_posts,id',
                'contractor_id' => 'required|exists:users,id',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'status' => 'nullable|string',
            ]);
            $contract = JobContract::create($data);
            $contract->load(['jobPost', 'contractor']);
            return response()->json([
                'message' => 'Contrato creado exitosamente',
                'data' => $contract
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el contrato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified job contract.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $contract = JobContract::findOrFail($id);
            $data = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
                'status' => 'nullable|string',
            ]);
            $contract->update($data);
            $contract->load(['jobPost', 'contractor']);
            return response()->json([
                'message' => 'Contrato actualizado exitosamente',
                'data' => $contract
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Contrato no encontrado',
                'error' => "No se encontró un contrato con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el contrato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified job contract.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $contract = JobContract::findOrFail($id);
            $contract->delete();
            return response()->json([
                'message' => 'Contrato eliminado exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Contrato no encontrado',
                'error' => "No se encontró un contrato con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar el contrato',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        /**
         * Permanently delete a job contract (force delete).
         */
        public function forceDelete($id): JsonResponse
        {
            try {
                $contract = JobContract::withTrashed()->findOrFail($id);
                $contract->forceDelete();
                return response()->json([
                    'message' => 'Contrato eliminado permanentemente',
                    'success' => true
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Contrato no encontrado',
                    'error' => "No se encontró un contrato con el ID: {$id}"
                ], 404);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error al eliminar permanentemente el contrato',
                    'error' => $e->getMessage(),
                    'success' => false
                ], 500);
            }
        }
}
