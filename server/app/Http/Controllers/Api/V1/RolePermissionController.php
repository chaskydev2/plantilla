<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Spatie\Permission\Models\Role;
use App\Http\Resources\Permission\PermissionCollection;
use App\Http\Requests\Role\SyncPermissionsRequest;
use App\Http\Requests\Pagination\PaginationRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Gate;

class RolePermissionController extends Controller
{
    public function rolePermissions(PaginationRequest $request, Role $role): JsonResponse
    {
        Gate::authorize('rol_permiso_listar');

        $permissions = $role->permissions()
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

        return (new PermissionCollection($permissions))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function syncPermissions(SyncPermissionsRequest $request, Role $role): JsonResponse
    {
        Gate::authorize('rol_permiso_editar');

        $role->syncPermissions($request->permissions);

        $permissions = $role->permissions()
            ->when(
                $request->search,
                fn($query, $search) =>
                $query->where('name', 'like', "%{$search}%")
            )
            ->orderBy($request->sortBy ?? 'id', $request->sortOrder ?? 'asc')
            ->paginate($request->perPage ?? 10);

        return (new PermissionCollection($permissions))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
