<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\TechnicalSkill\StoreTechnicalSkillRequest;
use App\Http\Requests\Auth\TechnicalSkill\UpdateTechnicalSkillRequest;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Resources\Auth\TechnicalSkill\TechnicalSkillCollection;
use App\Http\Resources\Auth\TechnicalSkill\TechnicalSkillResource;
use App\Models\TechnicalSkill;
use App\Models\User;

class TechnicalSkillController extends Controller
{
    public function index(PaginationRequest $request, $user): JsonResponse
    {
        $query = TechnicalSkill::query()
            ->search($request->input('search'))
            ->filterByUser($user)
            ->filterByType($request->input('type') ?? '')
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

        return (new TechnicalSkillCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        $result = TechnicalSkill::find($id);

        return (new TechnicalSkillResource($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreTechnicalSkillRequest $request, $user): JsonResponse
    {
        $user = User::findOrFail($user);
        $result = $user->technicalSkills()->create($request->validated());
        $validatedData['edit_profile'] = false;
        $user->update($validatedData);

        return (new TechnicalSkillResource($result))
            ->additional([
                'success' => true,
                'message' => 'Habilidad Tecnica Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateTechnicalSkillRequest $request, $user, $id): JsonResponse
    {
        $user = User::findOrFail($user);
        $user->technicalSkills()->where('id', $id)->update($request->validated());
        
        $result = TechnicalSkill::findOrFail($id);

        $validatedData['edit_profile'] = false;
        $user->update($validatedData);
        return (new TechnicalSkillResource($result))
            ->additional([
                'success' => true,
                'message' => 'Habilidad Tecnica actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($user, $id): JsonResponse
    {
        $result = TechnicalSkill::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Habilidad Tecnica Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
