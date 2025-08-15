<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AcademicTraining\StoreAcademicTrainingRequest;
use App\Http\Requests\Auth\AcademicTraining\UpdateAcademicTrainingRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Auth\AcademicTraining\AcademicTrainingCollection;
use App\Http\Resources\Auth\AcademicTraining\AcademicTrainingResource;
use App\Models\AcademicTraining;

class AcademicTrainingController extends Controller
{
    public function index(PaginationRequest $request, $user): JsonResponse
    {
        $query = AcademicTraining::query()
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

        return (new AcademicTrainingCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        $result = AcademicTraining::find($id);

        return (new AcademicTrainingResource($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreAcademicTrainingRequest $request, $user): JsonResponse
    {
        $user = User::findOrFail($user);
        $result = $user->academicTrainings()->create($request->validated());
        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new AcademicTrainingResource($result))
            ->additional([
                'success' => true,
                'message' => 'Formación Academica Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateAcademicTrainingRequest $request, $user, $id): JsonResponse
    {
        $user = User::findOrFail($user);
        $user->academicTrainings()->where('id', $id)->update($request->validated());
        
        $result = AcademicTraining::findOrFail($id);

        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new AcademicTrainingResource($result))
            ->additional([
                'success' => true,
                'message' => 'Formación Academica actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($user, $id): JsonResponse
    {
        $result = AcademicTraining::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Formación Academica Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
