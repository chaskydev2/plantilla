<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\JobPost;
use App\Models\HomeownerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\File;

class JobPostController extends Controller  {

    public function changeAprobationStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'status_aprobation' => ['required', 'boolean'],
        ]);

        $jobPost = JobPost::find($id);
        if (!$jobPost) {
            return response()->json([
                'success' => false,
                'message' => 'No found job post.'
            ], 404);
        }

        $jobPost->status_aprobation = $request->input('status_aprobation');
        $jobPost->save();

        return response()->json([
            'success' => true,
            'message' => 'Approval status updated.',
            'data' => $jobPost
        ]);
    }
    
    public function publicIndex(Request $request): JsonResponse
    {
        $query = JobPost::with(['homeowner.user', 'service'])
            ->where('status_aprobation', true);

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

        $perPage = $request->get('per_page', 15);
        $jobPosts = $query->paginate($perPage);

        return response()->json($jobPosts);
    }
    /**
     * Muestra toda la información detallada de un JobPost, incluyendo relaciones.
     */


    public function destroyMany(Request $request): JsonResponse
    {
        $ids = $request->input('ids', []);
        if (!is_array($ids) || empty($ids)) {
            return response()->json([
                'success' => false,
                'message' => 'You must send an array of IDs to delete.'
            ], 400);
        }

        if (count($ids) === 1) {
            $jobPost = JobPost::find($ids[0]);
            if (!$jobPost) {
                return response()->json([
                    'success' => false,
                    'message' => 'No job post found with the provided ID.'
                ], 404);
            }
            $this->deleteImageIfExists($jobPost->image_path);
            $jobPost->delete();
            return response()->json([
                'success' => true,
                'deleted' => 1,
                'message' => 'Job post deleted successfully.'
            ]);
        }

        $jobPosts = JobPost::whereIn('id', $ids)->get();
        $deleted = 0;
        foreach ($jobPosts as $jobPost) {
            $this->deleteImageIfExists($jobPost->image_path);
            $jobPost->delete();
            $deleted++;
        }

        return response()->json([
            'success' => true,
            'deleted' => $deleted,
            'message' => "{$deleted} job posts deleted."
        ]);
    }
    public function showFull($id): JsonResponse
    {
        try {
            $perPage = request()->get('per_page', 15);
            $jobPost = JobPost::with([
                'homeowner',
                'service',
                // 'contractor',
                // 'tags',
            ])->findOrFail($id);

            // Ejemplo: paginar 'applications' si existe la relación
            $applications = method_exists($jobPost, 'applications')
                ? $jobPost->applications()->paginate($perPage)
                : null;
            // Puedes agregar más relaciones paginadas aquí si lo necesitas

            $data = $jobPost->toArray();
            if ($applications !== null) {
                $data['applications'] = $applications;
            }

            return response()->json([
                'success' => true,
                'data' => $data
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Job post not found',
                'error' => "No job post found with ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error retrieving job post',
                'error' => $e->getMessage()
            ], 500);
        }
    }

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

        // Usar una Resource para cumplir el tipo de retorno
        return \App\Http\Resources\JobPostResource::collection($jobPosts);
    }

    public function byHomeowner(Request $request, int $homeowner): JsonResponse
    {
        // Si $homeowner es 0 o negativo, usar el usuario autenticado (si es homeowner)
        if ($homeowner <= 0) {
            $user = auth()->user();
            if ($user && HomeownerProfile::where('user_id', $user->id)->exists()) {
                $homeowner = $user->id;
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Could not determine authenticated homeowner.'
                ], 401);
            }
        }

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

        // Paginación
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
            $jobPost = JobPost::with(['homeowner', 'service'])->findOrFail($id);
            return response()->json([
                'message' => 'Job post found',
                'data' => $jobPost
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Job post not found',
                'error' => "No job post found with ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving job post',
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

            // Validar homeowner_id
            $homeownerId = $data['homeowner_id'] ?? null;
            $homeownerExists = false;
          
            $user = auth()->user();
                // Si el usuario autenticado es homeowner, usar su id
            if (HomeownerProfile::where('user_id', $user->id)->exists()) {
                    $data['homeowner_id'] = $user->id;
            }

            $imagePath = $this->persistImage($request);
            if ($imagePath === null) {
                $data['image_path'] = null;
            } elseif ($imagePath !== '__keep') {
                $data['image_path'] = $imagePath;
            }

            $jobPost = JobPost::create($data);
            $jobPost->load(['homeowner', 'service']);
            return response()->json([
                'message' => 'Job post created successfully',
                'data' => $jobPost
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating job post',
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

        // Remove non-column field
        unset($data['image']);

        $newImage = $this->persistImage($request, $jobPost->image_path);
        if ($newImage === null) {
            $data['image_path'] = null;
        } elseif ($newImage !== '__keep') {
            $data['image_path'] = $newImage;
        }

        // Save once
        $jobPost->fill($data);
        $jobPost->save();

        $jobPost->load(['homeowner', 'service']);
        return response()->json([
            'message' => 'Job post updated successfully',
            'data' => $jobPost,
            'datasent' => $request->all(),
        ]);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Job post not found',
            'error' => "No job post found with ID: {$id}"
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error updating job post',
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
                'message' => 'Job post deleted successfully'
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Job post not found',
                'error' => "No job post found with ID: {$id}"
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting job post',
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
                    'message' => 'Job post permanently deleted',
                    'success' => true
                ]);
            } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Job post not found',
                    'error' => "No job post found with ID: {$id}"
                ], 404);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Error permanently deleting job post',
                    'error' => $e->getMessage(),
                    'success' => false
                ], 500);
            }
        }
    private function validateData(Request $request, bool $isUpdate = false): array
    {
        $rules = [
             'homeowner_id' => ['required'],
            'service_id' => ['nullable', 'exists:services,id'],
            'title' => ['nullable'],
            'description' => ['nullable', 'string'],
            'deadline' => ['nullable', 'date'],
            'status' => ['nullable'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string'],
            'address_line1' => ['nullable', 'string', 'max:200'],
            'address_line2' => ['nullable', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:120'],
            'state_code' => ['nullable', 'string'],
            'postal_code' => ['nullable', 'string', 'max:15'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'image' => ['nullable'],
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
        if ($request->boolean('remove_image')) {
            $this->deleteImageIfExists($currentPath);
            return null;
        }

        // Soporte para imagen base64
        if ($request->filled('image') && is_string($request->image) && str_starts_with($request->image, 'data:image/')) {
            return $this->saveBase64Image($request->image, $currentPath);
        }

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

        $filename = uniqid('job_post_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/job-posts/' . $filename;
    }
    /**
     * Guarda una imagen enviada como base64 y retorna la ruta relativa.
     */
    public function saveBase64Image(string $base64Image, ?string $currentPath = null): ?string
    {
        // Eliminar imagen anterior si existe
        if ($currentPath) {
            $this->deleteImageIfExists($currentPath);
        }

        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
            $data = substr($base64Image, strpos($base64Image, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            $data = base64_decode($data);
            if ($data === false) {
                return null;
            }

            $directory = public_path('assets/job-posts');
            if (!File::isDirectory($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            $filename = uniqid('job_post_') . '.' . $type;
            $filePath = $directory . DIRECTORY_SEPARATOR . $filename;
            file_put_contents($filePath, $data);

            return 'assets/job-posts/' . $filename;
        }
        return null;
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
