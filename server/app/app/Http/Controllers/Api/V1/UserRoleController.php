<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\User\SyncRolesRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;

class UserRoleController extends Controller
{
    public function userRoles(User $user): JsonResponse
    {
        Gate::authorize('usuario_rol_listar');
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->email,
                'roles' => $user->roles->pluck('name')
            ]
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function syncRoles(SyncRolesRequest $request, User $user): JsonResponse
    {
        Gate::authorize('usuario_rol_editar');

        $user->syncRoles($request->roles);

        return response()->json([
            'success' => true,
            'message' => 'Roles actualizados para el usuario',
            'data' => [
                'user' => $user->email,
                'roles' => $user->roles->pluck('name')
            ]
        ])->setStatusCode(Response::HTTP_OK);
    }
}
