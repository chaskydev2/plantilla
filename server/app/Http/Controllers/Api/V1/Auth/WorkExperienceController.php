<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\WorkExperience\StoreWorkExperienceRequest;
use App\Http\Requests\Auth\WorkExperience\UpdateWorkExperienceRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Auth\WorkExperience\WorkExperienceCollection;
use App\Http\Resources\Auth\WorkExperience\WorkExperienceResource;
use App\Models\User;
use App\Models\WorkExperience;

class WorkExperienceController extends Controller
{
    public function index(PaginationRequest $request, $user): JsonResponse
    {
        $query = WorkExperience::query()
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

        return (new WorkExperienceCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        $result = WorkExperience::find($id);

        return (new WorkExperienceResource($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreWorkExperienceRequest $request, $user): JsonResponse
    {
        $user = User::findOrFail($user);
        $result = $user->workExperiences()->create($request->validated());
        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        
        return (new WorkExperienceResource($result))
            ->additional([
                'success' => true,
                'message' => 'Experiencia Laboral Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateWorkExperienceRequest $request, $user, $id): JsonResponse
    {
        $user = User::findOrFail($user);
        $user->workExperiences()->where('id', $id)->update($request->validated());
        
        $result = WorkExperience::findOrFail($id);

        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new WorkExperienceResource($result))
            ->additional([
                'success' => true,
                'message' => 'Experiencia Laboral actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($user, $id): JsonResponse
    {
        $result = WorkExperience::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Experiencia Laboral Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
