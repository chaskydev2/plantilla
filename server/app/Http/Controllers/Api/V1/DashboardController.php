<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Contractor;
use App\Models\HomeownerProfile;
use App\Models\JobPost;
use App\Models\Tag;
use App\Models\Profession;
use App\Models\Requirement;
use App\Models\JobContractor;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    /**
     * Get comprehensive dashboard statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            // Count total users
            $totalUsers = User::count();

            // Count homeowners (users with homeowner profile)
            $totalHomeowners = HomeownerProfile::count();

            // Count contractors
            $totalContractors = Contractor::count();

            // Count job posts
            $totalJobPosts = JobPost::count();

            // Count tags
            $totalTags = Tag::count();

            // Count professions
            $totalProfessions = Profession::count();

            // Get requirements with type breakdown
            $requirements = Requirement::select('id', 'title', 'description', 'type', 'order')
                ->orderBy('order', 'asc')
                ->get();

            $requirementsByType = $requirements->groupBy('type')->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'items' => $items->values()
                ];
            });

            // Count job contractors
            $totalJobContractors = JobContractor::count();

            // Get job contractors with complete information
            $jobContractors = JobContractor::with([
                'creator',
                'homeowner.user'
            ])->orderBy('created_at', 'desc')
                ->limit(50)
                ->get()
                ->map(function ($jobContractor) {
                    return [
                        'id' => $jobContractor->id,
                        'title' => $jobContractor->title,
                        'description' => $jobContractor->description,
                        'location' => $jobContractor->location,
                        'service_type' => $jobContractor->service_type,
                        'amount_paid' => $jobContractor->amount_paid,
                        'is_active' => $jobContractor->is_active,
                        'job_date' => $jobContractor->job_date,
                        'creator_details' => [
                            'id' => $jobContractor->creator->id ?? null,
                            'name' => $jobContractor->creator->name ?? 'N/A',
                            'email' => $jobContractor->creator->email ?? 'N/A',
                        ],
                        'homeowner_details' => [
                            'user_id' => $jobContractor->homeowner->user_id ?? null,
                            'name' => $jobContractor->homeowner->user->name ?? 'N/A',
                            'email' => $jobContractor->homeowner->user->email ?? 'N/A',
                            'city' => $jobContractor->homeowner->city ?? 'N/A',
                        ],
                        'created_at' => $jobContractor->created_at,
                    ];
                });

            // Get recent job posts
            $recentJobPosts = JobPost::with(['homeowner.user', 'service'])
                ->select('id', 'title', 'description', 'status', 'status_aprobation', 'price', 'currency', 'deadline', 'city', 'homeowner_id', 'service_id', 'created_at')
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get()
                ->map(function ($jobPost) {
                    return [
                        'id' => $jobPost->id,
                        'title' => $jobPost->title,
                        'description' => $jobPost->description,
                        'status' => $jobPost->status,
                        'status_aprobation' => $jobPost->status_aprobation,
                        'price' => $jobPost->price,
                        'currency' => $jobPost->currency,
                        'deadline' => $jobPost->deadline,
                        'city' => $jobPost->city,
                        'homeowner_name' => $jobPost->homeowner->user->name ?? 'N/A',
                        'service_name' => $jobPost->service->name ?? 'N/A',
                        'created_at' => $jobPost->created_at,
                    ];
                });

            // Get professions with contractor counts
            $professions = Profession::select('id', 'name', 'slug', 'description', 'service_id')
                ->withCount('contractors')
                ->orderBy('name', 'asc')
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'summary' => [
                        'total_users' => $totalUsers,
                        'total_homeowners' => $totalHomeowners,
                        'total_contractors' => $totalContractors,
                        'total_job_posts' => $totalJobPosts,
                        'total_tags' => $totalTags,
                        'total_professions' => $totalProfessions,
                        'total_job_contractors' => $totalJobContractors,
                        'total_requirements' => $requirements->count(),
                    ],
                    'requirements' => [
                        'total' => $requirements->count(),
                        'by_type' => $requirementsByType,
                        'all' => $requirements
                    ],
                    'job_contractors' => $jobContractors,
                    'recent_job_posts' => $recentJobPosts,
                    'professions' => $professions,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get detailed statistics with filters
     */
    public function getDetailedStats(): JsonResponse
    {
        try {
            // User statistics breakdown
            $userStats = [
                'total' => User::count(),
                'verified_email' => User::whereNotNull('email_verified_at')->count(),
                'unverified_email' => User::whereNull('email_verified_at')->count(),
                'with_edit_profile' => User::where('edit_profile', true)->count(),
                'verified_users' => User::where('verification', true)->count(),
            ];

            // Contractor statistics (using contract_status field)
            $contractorStats = [
                'total' => Contractor::count(),
                'approved' => Contractor::where('contract_status', 'aprobado')->count(),
                'pending' => Contractor::where('contract_status', 'pendiente')->count(),
                'rejected' => Contractor::where('contract_status', 'rechazado')->count(),
                'suspended' => Contractor::where('contract_status', 'suspendido')->count(),
                'insured' => Contractor::where('is_insured', true)->count(),
            ];

            // JobPost statistics
            $jobPostStats = [
                'total' => JobPost::count(),
                'open' => JobPost::where('status', 'open')->count(),
                'in_progress' => JobPost::where('status', 'in_progress')->count(),
                'completed' => JobPost::where('status', 'completed')->count(),
                'cancelled' => JobPost::where('status', 'cancelled')->count(),
                'approved' => JobPost::where('status_aprobation', true)->count(),
            ];

            // Get all services with profession counts
            $services = Service::select('id', 'name', 'slug', 'icon', 'image', 'description', 'created_at')
                ->withCount('professions')
                ->orderBy('name', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'user_stats' => $userStats,
                    'contractor_stats' => $contractorStats,
                    'job_post_stats' => $jobPostStats,
                    'services' => $services,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching detailed statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get requirements list with detailed information
     */
    public function getRequirements(): JsonResponse
    {
        try {
            $requirements = Requirement::select(
                'id',
                'title',
                'description',
                'type',
                'order',
                'created_at',
                'updated_at'
            )
                ->orderBy('order', 'asc')
                ->orderBy('created_at', 'desc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $requirements
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching requirements',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get job contractors list with pagination and detailed info
     */
    public function getJobContractors(): JsonResponse
    {
        try {
            $jobContractors = JobContractor::with([
                'creator',
                'homeowner.user'
            ])->orderBy('created_at', 'desc')
                ->paginate(20)
                ->map(function ($jobContractor) {
                    return [
                        'id' => $jobContractor->id,
                        'title' => $jobContractor->title,
                        'description' => $jobContractor->description,
                        'location' => $jobContractor->location,
                        'service_type' => $jobContractor->service_type,
                        'image_url' => $jobContractor->image_url,
                        'url' => $jobContractor->url,
                        'amount_paid' => $jobContractor->amount_paid,
                        'is_active' => $jobContractor->is_active,
                        'comment' => $jobContractor->comment,
                        'job_date' => $jobContractor->job_date,
                        'creator' => [
                            'id' => $jobContractor->creator->id ?? null,
                            'name' => $jobContractor->creator->name ?? 'N/A',
                            'email' => $jobContractor->creator->email ?? 'N/A',
                            'first_name' => $jobContractor->creator->first_name ?? 'N/A',
                            'last_name' => $jobContractor->creator->last_name ?? 'N/A',
                        ],
                        'homeowner' => [
                            'user_id' => $jobContractor->homeowner->user_id ?? null,
                            'name' => $jobContractor->homeowner->user->name ?? 'N/A',
                            'email' => $jobContractor->homeowner->user->email ?? 'N/A',
                            'city' => $jobContractor->homeowner->city ?? 'N/A',
                            'state_code' => $jobContractor->homeowner->state_code ?? 'N/A',
                            'address' => $jobContractor->homeowner->address_line1 ?? 'N/A',
                        ],
                        'created_at' => $jobContractor->created_at,
                        'updated_at' => $jobContractor->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $jobContractors
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching job contractors',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get professions with contractor counts
     */
    public function getProfessions(): JsonResponse
    {
        try {
            $professions = Profession::select('id', 'name', 'slug', 'description', 'icon', 'service_id')
                ->withCount('contractors')
                ->orderBy('name', 'asc')
                ->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $professions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching professions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get job posts with homeowner and service info
     */
    public function getJobPosts(): JsonResponse
    {
        try {
            $jobPosts = JobPost::with(['homeowner.user', 'service'])
                ->select('id', 'title', 'description', 'status', 'status_aprobation', 'price', 'currency', 'deadline', 'city', 'state_code', 'address_line1', 'homeowner_id', 'service_id', 'created_at', 'updated_at')
                ->orderBy('created_at', 'desc')
                ->paginate(20)
                ->map(function ($jobPost) {
                    return [
                        'id' => $jobPost->id,
                        'title' => $jobPost->title,
                        'description' => $jobPost->description,
                        'status' => $jobPost->status,
                        'status_aprobation' => $jobPost->status_aprobation,
                        'price' => $jobPost->price,
                        'currency' => $jobPost->currency,
                        'deadline' => $jobPost->deadline,
                        'city' => $jobPost->city,
                        'state_code' => $jobPost->state_code,
                        'address' => $jobPost->address_line1,
                        'homeowner' => [
                            'user_id' => $jobPost->homeowner->user_id ?? null,
                            'name' => $jobPost->homeowner->user->name ?? 'N/A',
                            'email' => $jobPost->homeowner->user->email ?? 'N/A',
                            'city' => $jobPost->homeowner->city ?? 'N/A',
                        ],
                        'service' => [
                            'id' => $jobPost->service->id ?? null,
                            'name' => $jobPost->service->name ?? 'N/A',
                        ],
                        'created_at' => $jobPost->created_at,
                        'updated_at' => $jobPost->updated_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $jobPosts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching job posts',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
