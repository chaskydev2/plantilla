<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\File;

class JobPostController extends Controller
{
    /**
     * Display a listing of job posts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = JobPost::with(['homeowner', 'service']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by homeowner
        if ($request->filled('homeowner_id')) {
            $query->where('homeowner_id', $request->homeowner_id);
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->float('max_price'));
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'deadline', 'status', 'price', 'city'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $jobPosts = $query->paginate($perPage);

        return response()->json($jobPosts);
    }

    public function byHomeowner(Request $request, int $homeowner): JsonResponse
    {
        $query = JobPost::with(['homeowner', 'service'])
            ->where('homeowner_id', $homeowner);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($builder) use ($search) {
                $builder->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('service_id')) {
            $query->where('service_id', $request->service_id);
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->float('min_price'));
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->float('max_price'));
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        if (in_array($sortBy, ['created_at', 'deadline', 'status', 'price', 'city'])) {
            $query->orderBy($sortBy, $sortDir);
        }

        $jobPosts = $query->get();

        return response()->json([
            'success' => true,
            'data' => $jobPosts,
        ]);
    }

    /**
     * Display the specified job post.
     */
    public function show($id): JsonResponse
    {
        try {
            $jobPost = JobPost::with(['homeowner', 'service'])->findOrFail($id);
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
            $data = $this->validateData($request);

            $imagePath = $this->persistImage($request);
            if ($imagePath && $imagePath !== '__keep') {
                $data['image_path'] = $imagePath;
            }

            $jobPost = JobPost::create($data);
            $jobPost->load(['homeowner', 'service']);
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
            $data = $this->validateData($request, true);

            if ($request->boolean('remove_image')) {
                $this->deleteImageIfExists($jobPost->image_path);
                $data['image_path'] = null;
            }

            $newImage = $this->persistImage($request, $jobPost->image_path);
            if ($newImage && $newImage !== '__keep') {
                $data['image_path'] = $newImage;
            }

            $jobPost->update($data);
            $jobPost->load(['homeowner', 'service']);
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
            $this->deleteImageIfExists($jobPost->image_path);
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
                $this->deleteImageIfExists($jobPost->image_path);
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
    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $rules = [
            'homeowner_id' => ['required', 'exists:homeowner_profiles,user_id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:50'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'address_line1' => ['nullable', 'string', 'max:200'],
            'address_line2' => ['nullable', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:120'],
            'state_code' => ['nullable', 'string', 'max:10'],
            'postal_code' => ['nullable', 'string', 'max:15'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:10240'],
        ];

        if ($isUpdate) {
            foreach ($rules as $field => &$rule) {
                if (is_array($rule)) {
                    array_unshift($rule, 'sometimes');
                }
            }
            $rules['homeowner_id'][] = 'required';
        }

        return $request->validate($rules);
    }

    private function persistImage(Request $request, ?string $currentPath = null): ?string
    {
        if (!$request->hasFile('image')) {
            return '__keep';
        }

        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return '__keep';
        }

        $this->deleteImageIfExists($currentPath);

        $directory = public_path('assets/job-posts');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('job_post_', true) . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/job-posts/' . $filename;
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
}
