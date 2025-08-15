<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MoralValue\MoralValueResource;
use App\Models\MoralValue;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\MoralValue\MoralValueCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\MoralValue\StoreMoralValueRequest;
use App\Http\Requests\MoralValue\UpdateMoralValueRequest;
use Illuminate\Support\Facades\Gate;

class MoralValueController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('valor_moral_listar');

        $query = MoralValue::query()
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

        return (new MoralValueCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('valor_moral_ver');

        $moralvalue = MoralValue::findOrFail($id);

        return (new MoralValueResource($moralvalue))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreMoralValueRequest $request): JsonResponse
    {
        Gate::authorize('valor_moral_crear');

        $moralvalue = MoralValue::create($request->validated());

        return (new MoralValueResource($moralvalue))
            ->additional([
                'success' => true,
                'message' => 'Principios morales Creados Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateMoralValueRequest $request, $id)
    {
        Gate::authorize('valor_moral_editar');

        $moralvalue = MoralValue::findOrFail($id);
        $moralvalue->update($request->validated());

        return (new MoralValueResource($moralvalue))
            ->additional([
                'success' => true,
                'message' => 'Principios morales actualizados Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('valor_moral_eliminar');

        $moralvalue = MoralValue::findOrFail($id);
        $moralvalue->delete();
        return response()->json([
            'success' => true,
            'message' => 'Principos morales Eliminados Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = MoralValue::all();

        return (MoralValueResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
