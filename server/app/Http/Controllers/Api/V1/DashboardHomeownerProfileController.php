<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\HomeownerProfile;
use App\Models\JobPost;
use App\Models\ScamAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DashboardHomeownerProfileController extends Controller
{
    /**
     * Get dashboard statistics for authenticated homeowner
     */
    public function myDashboard(Request $request): JsonResponse
    {
        $user = Auth::user();

        // Verificar si el usuario tiene un perfil de homeowner
        if (!$user->homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene un perfil de propietario'
            ], Response::HTTP_FORBIDDEN);
        }

        $homeownerProfile = $user->homeownerProfile;

        // Obtener servicios asociados
        $services = $homeownerProfile->services()
            ->with('professions')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->get();

        // Contar job posts
        $jobPostsCount = JobPost::where('homeowner_id', $homeownerProfile->user_id)->count();
        
        // Contar scam alerts
        $scamAlertsCount = ScamAlert::where('homeowner_profile_id', $homeownerProfile->user_id)->count();

        // Obtener job posts recientes
        $recentJobPosts = JobPost::where('homeowner_id', $homeownerProfile->user_id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Obtener scam alerts recientes
        $recentScamAlerts = ScamAlert::where('homeowner_profile_id', $homeownerProfile->user_id)
            ->with(['contractor.user'])
            ->orderByDesc('reported_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'homeowner_profile' => [
                    'user_id' => $homeownerProfile->user_id,
                    'city' => $homeownerProfile->city,
                    'state_code' => $homeownerProfile->state_code,
                    'country_code' => $homeownerProfile->country_code,
                ],
                'statistics' => [
                    'services_count' => $services->count(),
                    'job_posts_count' => $jobPostsCount,
                    'scam_alerts_count' => $scamAlertsCount,
                ],
                'services' => $services,
                'recent_job_posts' => $recentJobPosts,
                'recent_scam_alerts' => $recentScamAlerts,
            ],
        ], Response::HTTP_OK);
    }

    /**
     * Get dashboard statistics for specific homeowner profile
     */
    public function dashboard(HomeownerProfile $homeownerProfile): JsonResponse
    {
        // Obtener servicios asociados
        $services = $homeownerProfile->services()
            ->with('professions')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->get();

        // Contar job posts
        $jobPostsCount = JobPost::where('homeowner_id', $homeownerProfile->user_id)->count();
        
        // Contar scam alerts
        $scamAlertsCount = ScamAlert::where('homeowner_profile_id', $homeownerProfile->user_id)->count();

        // Obtener job posts recientes
        $recentJobPosts = JobPost::where('homeowner_id', $homeownerProfile->user_id)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        // Obtener scam alerts recientes
        $recentScamAlerts = ScamAlert::where('homeowner_profile_id', $homeownerProfile->user_id)
            ->with(['contractor.user'])
            ->orderByDesc('reported_at')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'homeowner_profile' => [
                    'user_id' => $homeownerProfile->user_id,
                    'city' => $homeownerProfile->city,
                    'state_code' => $homeownerProfile->state_code,
                    'country_code' => $homeownerProfile->country_code,
                ],
                'statistics' => [
                    'services_count' => $services->count(),
                    'job_posts_count' => $jobPostsCount,
                    'scam_alerts_count' => $scamAlertsCount,
                ],
                'services' => $services,
                'recent_job_posts' => $recentJobPosts,
                'recent_scam_alerts' => $recentScamAlerts,
            ],
        ], Response::HTTP_OK);
    }
}
