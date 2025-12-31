<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JobPostController extends Controller
{
    /**
     * Display a listing of job posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = JobPost::with('homeowner');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by homeowner
        if ($request->filled('homeowner_id')) {
            $query->where('homeowner_id', $request->homeowner_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'deadline', 'status'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $jobPosts = $query->paginate($perPage);

        return response()->json($jobPosts);
    }

    /**
     * Display the specified job post.
     */
    public function show($id): JsonResponse
    {
        try {
            $jobPost = JobPost::with('homeowner')->findOrFail($id);
            return response()->json([
                'message' => 'Publicación encontrada',
                'data' => $jobPost
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Publicación no encontrada',
                'error' => "No se encontró una publicación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created job post.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validate([
                'homeowner_id' => 'required|exists:homeowner_profiles,user_id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'deadline' => 'nullable|date',
                'status' => 'nullable|string',
            ]);
            $jobPost = JobPost::create($data);
            $jobPost->load('homeowner');
            return response()->json([
                'message' => 'Publicación creada exitosamente',
                'data' => $jobPost
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified job post.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $jobPost = JobPost::findOrFail($id);
            $data = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'deadline' => 'nullable|date',
                'status' => 'nullable|string',
            ]);
            $jobPost->update($data);
            $jobPost->load('homeowner');
            return response()->json([
                'message' => 'Publicación actualizada exitosamente',
                'data' => $jobPost
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Publicación no encontrada',
                'error' => "No se encontró una publicación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified job post.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $jobPost = JobPost::findOrFail($id);
            $jobPost->delete();
            return response()->json([
                'message' => 'Publicación eliminada exitosamente'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Publicación no encontrada',
                'error' => "No se encontró una publicación con el ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al eliminar la publicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        /**
         * Permanently delete a job post (force delete).
         */
        public function forceDelete($id): JsonResponse
        {
            try {
                $jobPost = JobPost::withTrashed()->findOrFail($id);
                $jobPost->forceDelete();
                return response()->json([
                    'message' => 'Publicación eliminada permanentemente',
                    'success' => true
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Publicación no encontrada',
                    'error' => "No se encontró una publicación con el ID: {$id}"
                ], 404);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error al eliminar permanentemente la publicación',
                    'error' => $e->getMessage(),
                    'success' => false
                ], 500);
            }
        }
}
