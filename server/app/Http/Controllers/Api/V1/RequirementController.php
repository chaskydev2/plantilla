<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Requirement\RequirementResource;
use App\Models\Requirement;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Requirement\RequirementCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Requirement\StoreRequirementRequest;
use App\Http\Requests\Requirement\UpdateRequirementRequest;
use Illuminate\Support\Facades\Gate;

class RequirementController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('requisito_listar');

        $query = Requirement::query()
            ->search($request->input('search'))
            ->sort(
                $request->input('sortBy.sort', 'id'),
                $request->input('sortBy.order', 'asc')
            )->orderBy('order', 'asc');
        
        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $result = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return (new RequirementCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('requisito_ver');

        $requirement = Requirement::findOrFail($id);

        return (new RequirementResource($requirement))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreRequirementRequest $request): JsonResponse
    {
        Gate::authorize('requisito_crear');

        $requirement = Requirement::create($request->validated());

        return (new RequirementResource($requirement))
            ->additional([
                'success' => true,
                'message' => 'Requisito creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateRequirementRequest $request, $id)
    {
        Gate::authorize('requisito_editar');

        $requirement = Requirement::findOrFail($id);
        $requirement->update($request->validated());

        return (new RequirementResource($requirement))
            ->additional([
                'success' => true,
                'message' => 'Requisito actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('requisito_eliminar');

        $requirement = Requirement::findOrFail($id);
        $requirement->delete();
        return response()->json([
            'success' => true,
            'message' => 'Requisito eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(Request $request): JsonResponse
    {
        $query = Requirement::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $result = $query->orderBy('order', 'asc')->get();

        return (RequirementResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
