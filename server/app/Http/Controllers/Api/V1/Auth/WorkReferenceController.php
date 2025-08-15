<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\WorkReference\StoreWorkReferenceRequest;
use App\Http\Requests\Auth\WorkReference\UpdateWorkReferenceRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Auth\WorkReference\WorkReferenceCollection;
use App\Http\Resources\Auth\WorkReference\WorkReferenceResource;
use App\Models\User;
use App\Models\WorkReference;

class WorkReferenceController extends Controller
{
    public function index(PaginationRequest $request, $user): JsonResponse
    {
        $query = WorkReference::query()
            ->search($request->input('search'))
            ->filterByUser($user)
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

        return (new WorkReferenceCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        $result = WorkReference::find($id);

        return (new WorkReferenceResource($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreWorkReferenceRequest $request, $user): JsonResponse
    {
        $user = User::findOrFail($user);
        $result = $user->workReferences()->create($request->validated());
        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new WorkReferenceResource($result))
            ->additional([
                'success' => true,
                'message' => 'Experiencia Laboral Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateWorkReferenceRequest $request, $user, $id): JsonResponse
    {
        $user = User::findOrFail($user);
        $user->workReferences()->where('id', $id)->update($request->validated());
        
        $result = WorkReference::findOrFail($id);
        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new WorkReferenceResource($result))
            ->additional([
                'success' => true,
                'message' => 'Experiencia Laboral actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($user, $id): JsonResponse
    {
        $result = WorkReference::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Experiencia Laboral Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
