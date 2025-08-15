<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\User\UserCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\Auth\ProfileResource;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('usuario_listar');

        $query = User::query()
            ->withTrashed()
            ->excludeAdmin()
            ->search($request->input('search'))
            ->filterByRole($request->input('role'))
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

        return (new UserCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        Gate::authorize('usuario_listar');
        $users = User::query()->get(['id', 'first_name', 'last_name', 'name']);
        return UserResource::collection($users)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('usuario_ver');
        $user = User::with(['academicTrainings', 'workExperiences', 'technicalSkills', 'workReferences'])
            ->findOrFail($id);

        return (new ProfileResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        Gate::authorize('usuario_crear');

        $user = User::create($request->validated());

        if ($request->has('role_id')) {
            $role = Role::find($request->role_id);

            if ($role) {
                $user->syncRoles([$role->name]);
            }
        }
        return (new UserResource($user))
            ->additional([
                'success' => true,
                'message' => 'Usuario Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        Gate::authorize('usuario_editar');

        $result = User::findOrFail($id);
        $result->update($request->validated());

        if ($request->has('role_id')) {
            $role = Role::find($request->role_id);

            if ($role) {
                $result->syncRoles([$role->name]);
            }
        }
        return (new UserResource($result))
            ->additional([
                'success' => true,
                'message' => 'Usuario actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('usuario_eliminar');

        $result = User::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Usuario Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function restore($id): JsonResponse
    {
        Gate::authorize('usuario_restaurar');

        $result = User::withTrashed()->findOrFail($id);
        $result->restore();
        return response()->json([
            'success' => true,
            'message' => 'Usuario Restablecido Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
