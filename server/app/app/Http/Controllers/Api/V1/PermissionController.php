<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Permission\PermissionResource;
use App\Http\Resources\Permission\PermissionCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Permission;
use App\Http\Requests\Pagination\PaginationRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('permiso_listar');

        $permissions = Permission::query()
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

    public function all(Request $request): JsonResponse
    {
        Gate::authorize('permiso_listar');

        $permissions = Permission::query()->get(['id', 'name']); 

        return PermissionResource::collection($permissions)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function show(Permission $permission): JsonResponse
    {
        Gate::authorize('permiso_ver');
        return (new PermissionResource($permission))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
