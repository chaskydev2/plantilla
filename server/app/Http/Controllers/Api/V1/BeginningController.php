<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Beginning\BeginningResource;
use App\Models\Beginning;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Beginning\BeginningCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Beginning\StoreBeginningRequest;
use App\Http\Requests\Beginning\UpdateBeginningRequest;
use Illuminate\Support\Facades\Gate;

class BeginningController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('principio_listar');

        $query = Beginning::query()
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

        return (new BeginningCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('principio_ver');

        $beginning = Beginning::findOrFail($id);

        return (new BeginningResource($beginning))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreBeginningRequest $request): JsonResponse
    {
        Gate::authorize('principio_crear');

        $beginning = Beginning::create($request->validated());

        return (new BeginningResource($beginning))
            ->additional([
                'success' => true,
                'message' => 'Principios Creados Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBeginningRequest $request, $id)
    {
        Gate::authorize('principio_editar');

        $beginning = Beginning::findOrFail($id);
        $beginning->update($request->validated());

        return (new BeginningResource($beginning))
            ->additional([
                'success' => true,
                'message' => 'Principios actualizados Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('principio_eliminar');

        $beginning = Beginning::findOrFail($id);
        $beginning->delete();
        return response()->json([
            'success' => true,
            'message' => 'Principios Eliminados Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Beginning::all();

        return (BeginningResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
