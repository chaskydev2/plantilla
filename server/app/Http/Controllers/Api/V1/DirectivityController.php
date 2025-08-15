<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Directivity\DirectivityResource;
use App\Models\Directivity;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Directivity\DirectivityCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Directivity\StoreDirectivityRequest;
use App\Http\Requests\Directivity\UpdateDirectivityRequest;
use Illuminate\Support\Facades\Gate;

class DirectivityController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('directiva_listar');

        $query = Directivity::query()
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

        return (new DirectivityCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('directiva_ver');

        $directivity = Directivity::findOrFail($id);

        return (new DirectivityResource($directivity))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreDirectivityRequest $request): JsonResponse
    {
        Gate::authorize('directiva_crear');

        $directivity = Directivity::create($request->validated());

        return (new DirectivityResource($directivity))
            ->additional([
                'success' => true,
                'message' => 'directiva creada Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateDirectivityRequest $request, $id)
    {
        Gate::authorize('directiva_editar');

        $directivity = Directivity::findOrFail($id);
        $directivity->update($request->validated());

        return (new DirectivityResource($directivity))
            ->additional([
                'success' => true,
                'message' => 'directiva actualizada Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('directiva_eliminar');

        $directivity = Directivity::findOrFail($id);
        $directivity->delete();
        return response()->json([
            'success' => true,
            'message' => 'directiva eliminada Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Directivity::all();

        return (DirectivityResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
