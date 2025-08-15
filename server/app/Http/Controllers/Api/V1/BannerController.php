<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Banner\BannerResource;
use App\Models\Banner;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Banner\BannerCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Banner\StoreBannerRequest;
use App\Http\Requests\Banner\UpdateBannerRequest;
use Illuminate\Support\Facades\Gate;

class BannerController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('banner_listar');

        $query = Banner::query()
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

        return (new BannerCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('banner_ver');

        $banner = Banner::findOrFail($id);

        return (new BannerResource($banner))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreBannerRequest $request): JsonResponse
    {
        Gate::authorize('banner_crear');

        $banner = Banner::create($request->validated());

        return (new BannerResource($banner))
            ->additional([
                'success' => true,
                'message' => 'Banner creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBannerRequest $request, $id)
    {
        Gate::authorize('banner_editar');

        $banner = Banner::findOrFail($id);
        $banner->update($request->validated());

        return (new BannerResource($banner))
            ->additional([
                'success' => true,
                'message' => 'Banner actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('banner_eliminar');

        $banner = Banner::findOrFail($id);
        $banner->delete();
        return response()->json([
            'success' => true,
            'message' => 'Banner eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Banner::all();

        return (BannerResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
