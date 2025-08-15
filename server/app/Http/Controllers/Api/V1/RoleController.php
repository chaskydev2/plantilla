<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Role\RoleCollection;
use App\Http\Resources\Role\RoleResource;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Requests\Pagination\PaginationRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('rol_listar');
        $roles = Role::query()
            ->when($request->input('search'), fn($q, $search) =>
                $q->where('name', 'like', "%{$search}%"))
            ->orderBy($request->input('sortBy.sort', 'id'),
                $request->input('sortBy.order', 'asc'))
            ->paginate(
                $request->input('limit', 10),
                ['*'],
                'page',
                $request->input('page', 1)
            );

        return (new RoleCollection($roles))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function all(Request $request): JsonResponse
    {
        Gate::authorize('rol_listar');

        $roles = Role::query()->get(['id', 'name']); 

        return RoleResource::collection($roles)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreRoleRequest $request): JsonResponse
    {
        Gate::authorize('rol_crear');

        $role = Role::create(['name' => $request->name, 'guard_name' => 'api']);

        return (new RoleResource($role))
            ->additional(['success' => true, 'message' => 'Rol creado'])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function show(Role $role): JsonResponse
    {
        Gate::authorize('rol_ver');

        return (new RoleResource($role))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function update(UpdateRoleRequest $request, Role $role): JsonResponse
    {
        Gate::authorize('rol_editar');

        $role->update(['name' => $request->name]);

        return (new RoleResource($role))
            ->additional(['success' => true, 'message' => 'Rol actualizado'])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy(Role $role): JsonResponse
    {
        Gate::authorize('rol_eliminar');

        if ($role->users()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'El rol está asignado a usuarios'
            ], Response::HTTP_CONFLICT);
        }

        $role->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rol eliminado'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
