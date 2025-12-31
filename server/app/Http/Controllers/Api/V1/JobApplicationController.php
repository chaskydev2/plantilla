<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobApplicationController extends Controller
{
    /**
     * Display a listing of job applications.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = JobApplication::with(['jobPost', 'contractor']);

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
        if (in_array($sortBy, ['created_at', 'status'])) {
            $query->orderBy($sortBy, $sortDir);
        }
        // Pagination
        $perPage = $request->get('per_page', 15);
        $applications = $query->paginate($perPage);
        return response()->json($applications);
    }

    /**
     * Display the specified job application.
     */
    public function show($id): JsonResponse
    {
        try {
            $application = JobApplication::with(['jobPost', 'contractor'])->findOrFail($id);
            return response()->json([
                'message' => 'Postulación encontrada',
                'data' => $application
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Postulación no encontrada',
                'error' => "No se encontró una postulación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la postulación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created job application.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'job_post_id' => 'required|exists:job_posts,id',
                'contractor_id' => 'required|exists:users,id',
                'cover_letter' => 'nullable|string',
                'status' => 'nullable|string',
            ]);
            $application = JobApplication::create($data);
            $application->load(['jobPost', 'contractor']);
            return response()->json([
                'message' => 'Postulación creada exitosamente',
                'data' => $application
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la postulación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified job application.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $application = JobApplication::findOrFail($id);
            $data = $request->validate([
                'cover_letter' => 'nullable|string',
                'status' => 'nullable|string',
            ]);
            $application->update($data);
            $application->load(['jobPost', 'contractor']);
            return response()->json([
                'message' => 'Postulación actualizada exitosamente',
                'data' => $application
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Postulación no encontrada',
                'error' => "No se encontró una postulación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la postulación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified job application.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $application = JobApplication::findOrFail($id);
            $application->delete();
            return response()->json([
                'message' => 'Postulación eliminada exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Postulación no encontrada',
                'error' => "No se encontró una postulación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la postulación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        /**
         * Permanently delete a job application (force delete).
         */
        public function forceDelete($id): JsonResponse
        {
            try {
                $application = JobApplication::withTrashed()->findOrFail($id);
                $application->forceDelete();
                return response()->json([
                    'message' => 'Postulación eliminada permanentemente',
                    'success' => true
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Postulación no encontrada',
                    'error' => "No se encontró una postulación con el ID: {$id}"
                ], 404);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error al eliminar permanentemente la postulación',
                    'error' => $e->getMessage(),
                    'success' => false
                ], 500);
            }
        }
}
