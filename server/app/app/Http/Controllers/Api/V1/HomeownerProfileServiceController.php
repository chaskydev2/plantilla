<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomeownerProfileService\StoreHomeownerProfileServiceRequest;
use App\Http\Requests\HomeownerProfileService\SyncHomeownerProfileServicesRequest;
use App\Models\HomeownerProfile;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class HomeownerProfileServiceController extends Controller
{
    public function index(HomeownerProfile $homeownerProfile): JsonResponse
    {
        $services = $homeownerProfile->services()
            ->with('professions')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $services,
        ], Response::HTTP_OK);
    }

    public function store(
        StoreHomeownerProfileServiceRequest $request,
        HomeownerProfile $homeownerProfile
    ): JsonResponse {
        $serviceId = $request->validated('service_id');

        $homeownerProfile->services()->syncWithoutDetaching([$serviceId]);

        $service = $homeownerProfile->services()
            ->where('services.id', $serviceId)
            ->with('professions')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Service successfully associated to homeowner',
            'data' => $service,
        ], Response::HTTP_CREATED);
    }

    public function destroy(HomeownerProfile $homeownerProfile, Service $service): JsonResponse
    {
        $homeownerProfile->services()->detach($service->id);

        return response()->json([
            'success' => true,
            'message' => 'Service successfully unlinked',
        ], Response::HTTP_OK);
    }

    public function homeowners(Service $service): JsonResponse
    {
        $homeowners = $service->homeownerProfiles()
            ->with('user')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->orderBy('homeowner_profiles.user_id')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $homeowners,
        ], Response::HTTP_OK);
    }

    public function sync(
        SyncHomeownerProfileServicesRequest $request,
        HomeownerProfile $homeownerProfile
    ): JsonResponse {
        $serviceIds = collect(
            $request->validated('services') ?? $request->validated('service_ids') ?? []
        )
            ->filter()
            ->unique()
            ->values()
            ->all();

        $existingServiceIds = $homeownerProfile->services()->pluck('services.id')->all();
        $newServiceIds = array_values(array_diff($serviceIds, $existingServiceIds));

        foreach ($newServiceIds as $serviceId) {
            $homeownerProfile->services()->syncWithoutDetaching([$serviceId]);
        }

        $services = $homeownerProfile->services()
            ->with('professions')
            ->withPivot(['homeowner_profile_id', 'service_id', 'created_at', 'updated_at'])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Services synchronized successfully',
            'data' => $services,
        ], Response::HTTP_OK);
    }
}
