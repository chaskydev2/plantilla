<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractorTeamMember\StoreContractorTeamMemberRequest;
use App\Models\ContractorTeamMember;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;



class ContractorTeamMemberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContractorTeamMember::with(['leader.user', 'member.user']);

        if ($request->filled('leader_user_id')) {
            $query->where('leader_user_id', $request->integer('leader_user_id'));
        }

        $data = $query->get(['leader_user_id', 'member_user_id', 'status', 'compania'])->map(function ($pivot) {
            return [
                'leader_user_id' => $pivot->leader_user_id,
                'member_user_id' => $pivot->member_user_id,
                'status' => $pivot->status,
                'compania' => $pivot->compania,
                'leader' => $pivot->leader ? [
                    'user_id' => $pivot->leader->user_id,
                    'company_name' => $pivot->leader->company_name,
                    'city' => $pivot->leader->city,
                    'name' => $pivot->leader->user?->name,
                ] : null,
                'member' => $pivot->member ? [
                    'user_id' => $pivot->member->user_id,
                    'company_name' => $pivot->member->company_name,
                    'city' => $pivot->member->city,
                    'name' => $pivot->member->user?->name,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ], Response::HTTP_OK);
    }


    public function updateStatus(Request $request, int $memberUserId): JsonResponse
    {
        $validated = $request->validate([
            'leader_user_id' => ['required', 'integer'],
            'status' => ['required', 'in:pending,active,inactive'],
        ]);

        $pivot = ContractorTeamMember::where('member_user_id', $memberUserId)
            ->where('leader_user_id', $validated['leader_user_id'])
            ->firstOrFail();

        $pivot->status = $validated['status'];
        $pivot->save();

        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $pivot->only(['leader_user_id', 'member_user_id', 'status', 'compania']),
        ], Response::HTTP_OK);
    }

    public function indexByMember(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'member_user_id' => 'required|integer',
        ]);

        $query = ContractorTeamMember::with(['leader.user', 'member.user'])
            ->where('member_user_id', $validated['member_user_id']);

        $data = $query->get(['leader_user_id', 'member_user_id', 'status', 'compania'])->map(function ($pivot) {
            return [
                'leader_user_id' => $pivot->leader_user_id,
                'member_user_id' => $pivot->member_user_id,
                'status' => $pivot->status,
                'compania' => $pivot->compania,
                'leader' => $pivot->leader ? [
                    'user_id' => $pivot->leader->user_id,
                    'company_name' => $pivot->leader->company_name,
                    'city' => $pivot->leader->city,
                    'name' => $pivot->leader->user?->name,
                ] : null,
                'member' => $pivot->member ? [
                    'user_id' => $pivot->member->user_id,
                    'company_name' => $pivot->member->company_name,
                    'city' => $pivot->member->city,
                    'name' => $pivot->member->user?->name,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $data,
        ], Response::HTTP_OK);
    }


    public function store(StoreContractorTeamMemberRequest $request): JsonResponse
    {
        $pivot = ContractorTeamMember::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Member added to team successfully',
            'data' => $pivot->only(['leader_user_id', 'member_user_id', 'status', 'compania']),
        ], Response::HTTP_CREATED);
    }

    public function teamByLeader(int $leader): JsonResponse
    {
        $team = ContractorTeamMember::with(['member'])
            ->where('leader_user_id', $leader)
            ->get(['leader_user_id', 'member_user_id', 'status', 'compania'])
            ->map(function ($pivot) {
                return [
                    'leader_user_id' => $pivot->leader_user_id,
                    'member_user_id' => $pivot->member_user_id,
                    'status' => $pivot->status,
                    'compania' => $pivot->compania,
                    'member' => $pivot->member ? [
                        'user_id' => $pivot->member->user_id,
                        'company_name' => $pivot->member->company_name,
                        'city' => $pivot->member->city,
                        'name' => $pivot->member->user?->name,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $team,
        ], Response::HTTP_OK);
    }

    public function teamByMember(int $member): JsonResponse
    {
        // Buscar el líder del miembro dado
        $leaderRelation = ContractorTeamMember::where('leader_user_id', $member)->first();

        $leaderId = $leaderRelation->leader_user_id;

        // Traer todo el equipo de ese líder con nombres de usuario
        $team = ContractorTeamMember::with(['leader.user', 'member.user'])
            ->where('leader_user_id', $leaderId)
            ->get(['leader_user_id', 'member_user_id', 'status', 'compania']);

        return response()->json([
            'success' => true,
            'data' => $team,
        ], Response::HTTP_OK);
    }

    public function destroy(int $memberUserId): JsonResponse
    {
        // Elimina la relación del miembro con su líder
        $deleted = ContractorTeamMember::where('member_user_id', $memberUserId)->delete();

        if (!$deleted) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found in team',
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'message' => 'Member removed from team',
        ], Response::HTTP_OK);
    }
}
