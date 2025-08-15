<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\History\HistoryResource;
use App\Models\History;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\History\HistoryCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\History\StoreHistoryRequest;
use App\Http\Requests\History\UpdateHistoryRequest;
use Illuminate\Support\Facades\Gate;

class HistoryController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('historia_listar');

        $query = History::query()
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

        return (new HistoryCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('historia_ver');

        $history = History::findOrFail($id);

        return (new HistoryResource($history))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreHistoryRequest $request): JsonResponse
    {
        Gate::authorize('historia_crear');

        $history = History::create($request->validated());

        return (new HistoryResource($history))
            ->additional([
                'success' => true,
                'message' => 'Historia creada Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateHistoryRequest $request, $id)
    {
        Gate::authorize('historia_editar');

        $history = History::findOrFail($id);
        $history->update($request->validated());

        return (new HistoryResource($history))
            ->additional([
                'success' => true,
                'message' => 'Historia actualizada Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('historia_eliminar');

        $history = History::findOrFail($id);
        $history->delete();
        return response()->json([
            'success' => true,
            'message' => 'Historia eliminada Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = History::all();

        return (HistoryResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
