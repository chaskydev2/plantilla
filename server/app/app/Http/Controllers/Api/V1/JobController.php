<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class JobController extends Controller
{
    /**
     * Display a listing of jobs with filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Job::with(['creator', 'homeowner']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->search($search);
        }

        // Filter by active status
        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by creator
        if ($request->filled('id_creator')) {
            $query->byCreator($request->id_creator);
        }

        // Filter by homeowner
        if ($request->filled('id_homeowner')) {
            $query->byHomeowner($request->id_homeowner);
        }

        // Filter by service type
        if ($request->filled('service_type')) {
            $query->byServiceType($request->service_type);
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->byLocation($request->location);
        }

        // Date range filter
        if ($request->filled('start_date') || $request->filled('end_date')) {
            $query->dateRange($request->start_date, $request->end_date);
        }

        // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortDir = $request->get('sort_dir', 'desc');
            $query->orderBy($sortBy, $sortDir);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json($results);
    }

    /**
     * Store a newly created job
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'id_creator' => ['required', Rule::exists('users', 'id')],
            'id_homeowner' => ['nullable', Rule::exists('homeowner_profiles', 'user_id')],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
            'service_type' => 'required|string|max:255',
            'image_url' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'url' => 'nullable|url',
            'amount_paid' => 'nullable|numeric|min:0',
            'is_active' => 'nullable|boolean',
            'comment' => 'nullable|string',
            'job_date' => 'nullable|date',
        ]);

        DB::beginTransaction();
        try {
            // Handle image upload
            $imageUrl = null;
            $file = $request->file('image_url');
            if ($file && $file->isValid()) {
                $filename = uniqid('job_') . '.' . $file->getClientOriginalExtension();
                $file->move(public_path('assets/jobs'), $filename);
                $imageUrl = 'assets/jobs/' . $filename;
            }

            // Create job with image URL
            $validated['image_url'] = $imageUrl;
            $job = Job::create($validated);
            $job->load(['creator', 'homeowner']);

            DB::commit();
            return response()->json(['success' => true, 'data' => $job], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error creating job: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_files' => $request->allFiles(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error creating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified job
     */
    public function show($id): JsonResponse
    {
        $job = Job::with(['creator', 'homeowner'])->findOrFail($id);
        return response()->json(['success' => true, 'data' => $job]);
    }

    /**
     * Update the specified job
     */
    public function update(Request $request, $id): JsonResponse
    {
        $job = Job::findOrFail($id);

        $validated = $request->validate([
            'id_creator' => ['sometimes', Rule::exists('users', 'id')],
            'id_homeowner' => ['sometimes', 'nullable', Rule::exists('homeowner_profiles', 'user_id')],
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|nullable|string',
            'location' => 'sometimes|string|max:255',
            'service_type' => 'sometimes|string|max:255',
            'image_url' => 'sometimes|nullable|file|mimes:jpg,jpeg,png,gif,webp|max:5120',
            'url' => 'sometimes|nullable|url',
            'amount_paid' => 'sometimes|nullable|numeric|min:0',
            'is_active' => 'sometimes|nullable|boolean',
            'comment' => 'sometimes|nullable|string',
            'job_date' => 'sometimes|nullable|date',
        ]);

        DB::beginTransaction();
        try {
            // Handle image upload if provided
            if ($request->hasFile('image_url')) {
                $file = $request->file('image_url');
                if ($file && $file->isValid()) {
                    // Delete old image if exists
                    if ($job->image_url && file_exists(public_path($job->image_url))) {
                        unlink(public_path($job->image_url));
                    }

                    // Save new image
                    $filename = uniqid('job_') . '.' . $file->getClientOriginalExtension();
                    $file->move(public_path('assets/jobs'), $filename);
                    $validated['image_url'] = 'assets/jobs/' . $filename;
                }
            } else {
                // Remove image_url from validated if not provided
                unset($validated['image_url']);
            }

            $job->update($validated);
            $job->load(['creator', 'homeowner']);

            DB::commit();
            return response()->json(['success' => true, 'data' => $job], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error updating job: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_files' => $request->allFiles(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error updating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete the specified job
     */
    public function destroy($id): JsonResponse
    {
        $job = Job::findOrFail($id);

        DB::beginTransaction();
        try {
            $job->delete();

            DB::commit();
            return response()->json(['success' => true, 'message' => 'Job deleted successfully'], 200);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Error deleting job: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Error deleting job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update job status (active/inactive)
     */
    public function updateStatus(Request $request, $id): JsonResponse
    {
        $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $job = Job::findOrFail($id);
        $job->is_active = $request->boolean('is_active');
        $job->save();

        return response()->json([
            'success' => true,
            'message' => 'Job status updated successfully',
            'data' => $job,
        ]);
    }

    /**
     * Get jobs by creator (user)
     */
    public function jobsByCreator(Request $request, $creatorId): JsonResponse
    {
        $query = Job::with(['creator', 'homeowner'])
            ->byCreator($creatorId);

        // Optional filters
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Sorting and pagination
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->sort($sortBy, $sortDir);

        $perPage = $request->get('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json($results);
    }

    /**
     * Get jobs by homeowner
     */
    public function jobsByHomeowner(Request $request, $homeownerId): JsonResponse
    {
        $query = Job::with(['creator', 'homeowner'])
            ->byHomeowner($homeownerId);

        // Optional filters
        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Sorting and pagination
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->sort($sortBy, $sortDir);

        $perPage = $request->get('per_page', 15);
        $results = $query->paginate($perPage);

        return response()->json($results);
    }

    /**
     * Get jobs statistics
     */
    public function statistics(): JsonResponse
    {
        $stats = [
            'total' => Job::count(),
            'active' => Job::active()->count(),
            'inactive' => Job::inactive()->count(),
            'total_amount_paid' => Job::sum('amount_paid'),
        ];

        return response()->json(['success' => true, 'data' => $stats]);
    }

    public function activate(Request $request, $id): JsonResponse
        {
            $request->validate([
                'is_active' => ['required', 'boolean'],
            ]);
            $job = Job::findOrFail($id);
            $job->is_active = $request->boolean('is_active');
            $job->save();
            return response()->json([
                'success' => true,
                'message' => 'Job updated successfully',
                'data' => $job,
            ]);
        }
}
