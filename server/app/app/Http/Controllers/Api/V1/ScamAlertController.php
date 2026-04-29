<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ScamAlert\StoreScamAlertRequest;
use App\Http\Requests\ScamAlert\UpdateScamAlertRequest;
use App\Models\ScamAlert;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ScamAlertController extends Controller
{

    public function myHomeownerScanAlerts(Request $request): JsonResponse
    {
        $user = Auth()->user();
    

         $query = ScamAlert::query()
            ->with(['contractor.user', 'homeownerProfile.user'])
            ->orderByDesc('reported_at');

     
            $query->where('homeowner_profile_id',  $user->id);
    

        if ($request->filled('contractor_id')) {
            $query->where('contractor_id', $request->integer('contractor_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        } else {
            $query->whereIn('status', ['active', 'resolved']);
        }

        $alerts = $query->paginate($request->integer('per_page', 15));
        return response()->json($alerts, Response::HTTP_OK);

    }

    public function all(Request $request): JsonResponse
    {
        $query = ScamAlert::query()
            ->with(['contractor.user', 'homeownerProfile.user'])
            ->orderByDesc('reported_at');

        if ($request->filled('homeowner_profile_id')) {
            $query->where('homeowner_profile_id', $request->integer('homeowner_profile_id'));
        }

        if ($request->filled('contractor_id')) {
            $query->where('contractor_id', $request->integer('contractor_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        } else {
            $query->whereIn('status', ['active', 'resolved']);
        }

        $alerts = $query->paginate($request->integer('per_page', 15));

        return response()->json($alerts, Response::HTTP_OK);
    }

    public function index(Request $request): JsonResponse
    {
        $query = ScamAlert::query()
            ->with(['contractor.user', 'homeownerProfile.user'])
            ->orderByDesc('reported_at');

        if ($request->filled('homeowner_profile_id')) {
            $query->where('homeowner_profile_id', $request->integer('homeowner_profile_id'));
        }

        if ($request->filled('contractor_id')) {
            $query->where('contractor_id', $request->integer('contractor_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $alerts = $query->paginate($request->integer('per_page', 15));

        return response()->json($alerts, Response::HTTP_OK);
    }

    public function store(StoreScamAlertRequest $request): JsonResponse
    {
        $data = $request->validated();

        if (!isset($data['status'])) {
            $data['status'] = 'active';
        }

        $alert = ScamAlert::create($data);
        $alert->load(['contractor.user', 'homeownerProfile.user']);

        return response()->json([
            'success' => true,
            'message' => 'Scam alert created successfully',
            'data' => $alert,
        ], Response::HTTP_CREATED);
    }

    public function show(ScamAlert $scamAlert): JsonResponse
    {
        $scamAlert->load(['contractor.user', 'homeownerProfile.user']);

        return response()->json([
            'success' => true,
            'data' => $scamAlert,
        ], Response::HTTP_OK);
    }

    public function update(UpdateScamAlertRequest $request, ScamAlert $scamAlert): JsonResponse
    {
        $data = $request->validated();

        $user = $request->user();
        $isAdmin = $user?->hasRole('admin');

        if ($isAdmin) {
            unset($data['homeowner_profile_id']);
        }

        $scamAlert->update($data);
        $scamAlert->load(['contractor.user', 'homeownerProfile.user']);

        return response()->json([
            'success' => true,
            'message' => 'Scam alert updated successfully',
            'data' => $scamAlert,
        ], Response::HTTP_OK);
    }

    public function destroy(ScamAlert $scamAlert): JsonResponse
    {
        $scamAlert->delete();

        return response()->json([
            'success' => true,
            'message' => 'Scam alert deleted successfully',
        ], Response::HTTP_OK);
    }
}
