<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Agreement\AgreementResource;
use App\Models\Agreement;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Agreement\AgreementCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Agreement\StoreAgreementRequest;
use App\Http\Requests\Agreement\UpdateAgreementRequest;
use Illuminate\Support\Facades\Gate;

class AgreementController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('acuerdo_listar');
        
        $query = Agreement::query()
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

        return (new AgreementCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show($id): JsonResponse
    {
        Gate::authorize('acuerdo_ver');

        $agreement = Agreement::findOrFail($id);

        return (new AgreementResource($agreement))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreAgreementRequest $request): JsonResponse
    {
        Gate::authorize('acuerdo_crear');

        $agreement = Agreement::create($request->validated());
    
        return (new AgreementResource($agreement))
            ->additional([
                'success' => true,
                'message' => 'Acuerdo creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateAgreementRequest $request, $id)
    {
        Gate::authorize('acuerdo_editar');

        $agreement = Agreement::findOrFail($id);
        $agreement->update($request->validated());
        
        return (new AgreementResource($agreement))
            ->additional([
                'success' => true,
                'message' => 'Acuerdo actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('acuerdo_eliminar');

        $agreement = Agreement::findOrFail($id);
        $agreement->delete();
        return response()->json([
            'success' => true,
            'message' => 'Acuerdo eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {   
        $result = Agreement::all();

        return (AgreementResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
