<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractorTag\StoreContractorTagRequest;
use App\Http\Requests\ContractorTag\UpdateContractorTagRequest;
use App\Http\Resources\Tag\TagResource;
use App\Models\Contractor;
use App\Models\ContractorTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ContractorTagController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContractorTag::query()->with('tag');

        if ($request->filled('contractor_user_id')) {
            $query->where('contractor_user_id', $request->integer('contractor_user_id'));
        }

        $paginator = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        $paginator->getCollection()->transform(function (ContractorTag $pivot) {
            return [
                'contractor_user_id' => $pivot->contractor_user_id,
                'tag_id' => $pivot->tag_id,
                'tag' => new TagResource($pivot->tag),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'last_page' => $paginator->lastPage(),
            ],
        ], Response::HTTP_OK);
    }

    
    public function store(StoreContractorTagRequest $request): JsonResponse
    {
        $pivot = ContractorTag::create($request->validated());
        $pivot->load('tag');

        return (new TagResource($pivot->tag))
            ->additional([
                'success' => true,
                'contractor_user_id' => $pivot->contractor_user_id,
                'tag_id' => $pivot->tag_id,
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateContractorTagRequest $request): JsonResponse
    {
        $data = $request->validated();

        ContractorTag::where('contractor_user_id', $data['contractor_user_id'])
            ->where('tag_id', $data['tag_id'])
            ->update(['tag_id' => $data['new_tag_id']]);

        $pivot = ContractorTag::with('tag')
            ->where('contractor_user_id', $data['contractor_user_id'])
            ->where('tag_id', $data['new_tag_id'])
            ->firstOrFail();

        return (new TagResource($pivot->tag))
            ->additional([
                'success' => true,
                'contractor_user_id' => $pivot->contractor_user_id,
                'tag_id' => $pivot->tag_id,
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function tagsByContractor(Request $request, int $contractor): JsonResponse
    {
        $contractorModel = Contractor::findOrFail($contractor);

        $paginator = $contractorModel->tags()
            ->paginate(
                $request->input('limit', 10),
                ['*'],
                'page',
                $request->input('page', 1)
            );

        return TagResource::collection($paginator)
            ->additional(['success' => true])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy(Request $request): JsonResponse
    {
        $data = $request->validate([
            'contractor_user_id' => ['required', 'integer', 'exists:contractor_tag,contractor_user_id'],
            'tag_id' => ['required', 'integer', 'exists:contractor_tag,tag_id'],
        ]);

        $deleted = ContractorTag::where('contractor_user_id', $data['contractor_user_id'])
            ->where('tag_id', $data['tag_id'])
            ->delete();

        return response()->json([
            'success' => $deleted > 0,
            'message' => $deleted ? 'Tag removed from contractor' : 'Relation to delete not found',
        ], Response::HTTP_OK);
    }
}
