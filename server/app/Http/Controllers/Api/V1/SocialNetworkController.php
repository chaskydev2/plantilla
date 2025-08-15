<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\SocialNetwork\SocialNetworkResource;
use App\Models\SocialNetwork;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\SocialNetwork\SocialNetworkCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\SocialNetwork\StoreSocialNetworkRequest;
use App\Http\Requests\SocialNetwork\UpdateSocialNetworkRequest;
use Illuminate\Support\Facades\Gate;

class SocialNetworkController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('red_social_listar');

        $query = SocialNetwork::query()
            ->search($request->input('search'))
            ->sort(
                $request->input('sortBy.sort', 'id'),
                $request->input('sortBy.order', 'asc')
            );

        $result = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return (new SocialNetworkCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('redes_sociales_ver');

        $socialnetwork = SocialNetwork::findOrFail($id);

        return (new SocialNetworkResource($socialnetwork))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreSocialNetworkRequest $request): JsonResponse
    {
        Gate::authorize('red_social_crear');

        $socialnetwork = SocialNetwork::create($request->validated());

        return (new SocialNetworkResource($socialnetwork))
            ->additional([
                'success' => true,
                'message' => 'Red Social creada Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateSocialNetworkRequest $request, $id)
    {
        Gate::authorize('red_social_editar');

        $socialnetwork = SocialNetwork::findOrFail($id);
        $socialnetwork->update($request->validated());

        return (new SocialNetworkResource($socialnetwork))
            ->additional([
                'success' => true,
                'message' => 'Red Social actualizada Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('red_social_eliminar');

        $socialnetwork = SocialNetwork::findOrFail($id);
        $socialnetwork->delete();
        return response()->json([
            'success' => true,
            'message' => 'Red Social eliminada Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = SocialNetwork::all();

        return (SocialNetworkResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
