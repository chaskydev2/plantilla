<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AcademicTraining;
use App\Models\AttributeContractor;
use App\Models\Contractor;
use App\Models\JobContractor;
use App\Models\WorkExperience;
use App\Models\WorkReference;
use App\Models\TechnicalSkill;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class DashboardContractorController extends Controller
{
    /**
     * Dashboard for authenticated contractor
     */
    public function myDashboard(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user->contractor) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario no tiene perfil de contractor'
            ], Response::HTTP_FORBIDDEN);
        }

        return $this->buildDashboardResponse($user->contractor);
    }

    /**
     * Dashboard for specific contractor
     */
    public function dashboard(Contractor $contractor): JsonResponse
    {
        return $this->buildDashboardResponse($contractor);
    }

    /**
     * Export contractor profile as PDF (CV style)
     */
    public function exportPdf(Contractor $contractor)
    {
        $contractor->load(['user', 'professions', 'categories', 'teamMembers.user', 'teamLeaders.user']);

        $jobs = JobContractor::where('id_creator', $contractor->user_id)
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $workExperiences = WorkExperience::where('user_id', $contractor->user_id)
            ->orderByDesc('start_date')
            ->get();

        $workReferences = WorkReference::where('user_id', $contractor->user_id)->get();

        $technicalSkills = TechnicalSkill::where('user_id', $contractor->user_id)->get();

        $academicTrainings = AcademicTraining::where('user_id', $contractor->user_id)
            ->orderByDesc('graduation_date')
            ->get();

        $requirements = AttributeContractor::with('attribute')
            ->where('contractor_id', $contractor->user_id)
            ->get();

        $teamMembers = $contractor->teamMembers;
        $teamLeaders = $contractor->teamLeaders;
        $allTeam = $teamMembers->merge($teamLeaders)->unique('user_id')->values();

        $pdf = Pdf::loadView('pdf.contractor_cv', [
            'contractor' => $contractor,
            'user' => $contractor->user,
            'jobs' => $jobs,
            'workExperiences' => $workExperiences,
            'workReferences' => $workReferences,
            'technicalSkills' => $technicalSkills,
            'academicTrainings' => $academicTrainings,
            'requirements' => $requirements,
            'professions' => $contractor->professions,
            'categories' => $contractor->categories,
            'team' => $allTeam,
        ])->setPaper('a4', 'portrait');

        $filename = 'contractor_cv_' . $contractor->user_id . '.pdf';
        return $pdf->download($filename);
    }

    private function buildDashboardResponse(Contractor $contractor): JsonResponse
    {
        // Team members (lider -> miembros) y team leaders (cuando es miembro de otro equipo)
        $teamMembers = $contractor->teamMembers()->with(['user', 'professions'])->get();
        $teamLeaders = $contractor->teamLeaders()->with(['user', 'professions'])->get();

        // Todos los miembros relacionados (unión sin duplicados)
        $allTeam = $teamMembers->merge($teamLeaders)->unique('user_id')->values();

        // Jobs created by contractor
        $jobsQuery = JobContractor::where('id_creator', $contractor->user_id)
            ->orderByDesc('created_at');
        $jobsCount = (clone $jobsQuery)->count();
        $totalPaid = (clone $jobsQuery)->sum('amount_paid');
        $averagePaid = $jobsCount > 0 ? round($totalPaid / $jobsCount, 2) : 0;
        $recentJobs = (clone $jobsQuery)->limit(5)->get(['id','title','location','service_type','amount_paid','is_active','created_at','job_date']);

        // Resumen por tipo de servicio (puede representar la "profesión" usada en el trabajo)
        $jobsByServiceType = JobContractor::selectRaw('service_type, COUNT(*) as jobs_count, COALESCE(SUM(amount_paid),0) as total_paid, COALESCE(AVG(amount_paid),0) as avg_paid')
            ->where('id_creator', $contractor->user_id)
            ->groupBy('service_type')
            ->orderBy('service_type')
            ->get();

        // Work experiences
        $workExperiences = WorkExperience::where('user_id', $contractor->user_id)
            ->orderByDesc('start_date')
            ->get();

        // Requirements (attribute contractors)
        $requirements = AttributeContractor::with('attribute')
            ->where('contractor_id', $contractor->user_id)
            ->get();

        // Professions and categories
        $professions = $contractor->professions;
        $categories = $contractor->categories;

        return response()->json([
            'success' => true,
            'data' => [
                'contractor' => [
                    'user_id' => $contractor->user_id,
                    'company_name' => $contractor->company_name,
                    'service_area' => $contractor->service_area,
                    'city' => $contractor->city,
                    'state_code' => $contractor->state_code,
                    'country_code' => $contractor->country_code,
                    'lat' => $contractor->lat,
                    'lng' => $contractor->lng,
                    'preferred_zip' => $contractor->preferred_zip,
                    'address_line1' => $contractor->address_line1,
                    'address_line2' => $contractor->address_line2,
                ],
                'statistics' => [
                    'team_members_count' => $allTeam->count(),
                    'jobs_count' => $jobsCount,
                    'total_paid' => (float) $totalPaid,
                    'average_paid' => (float) $averagePaid,
                ],
                'team_members' => $allTeam,
                'jobs' => $recentJobs,
                'jobs_summary' => [
                    'by_service_type' => $jobsByServiceType,
                ],
                'work_experiences' => $workExperiences,
                'requirements' => $requirements,
                'professions' => $professions,
                'categories' => $categories,
            ],
        ], Response::HTTP_OK);
    }
}
