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
    /**
     * Guardar imagen del banner
     */
    private function persistImage($request, ?string $currentPath): ?string
    {
        if ($request->boolean('remove_image')) {
            $this->deleteImageIfExists($currentPath);
            return null;
        }

        if (!$request->hasFile('image')) {
            return '__keep';
        }

        $file = $request->file('image');
        if (!$file || !$file->isValid()) {
            return '__keep';
        }

        $this->deleteImageIfExists($currentPath);

        $directory = public_path('assets/banners');
        if (!\File::isDirectory($directory)) {
            \File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('banner_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/banners/' . $filename;
    }

    private function deleteImageIfExists(?string $path): void
    {
        if (!$path) {
            return;
        }
        $fullPath = public_path($path);
        if (\File::exists($fullPath)) {
            @\File::delete($fullPath);
        }
    }

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

        $data = $request->validated();
        $imagePath = $this->persistImage($request, null);
        $data['image'] = $imagePath === '__keep' ? null : $imagePath;

        $banner = Banner::create($data);

        return (new BannerResource($banner))
            ->additional([
                'success' => true,
                'message' => 'Banner created successfully',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateBannerRequest $request, $id)
    {
        Gate::authorize('banner_editar');

        $banner = Banner::findOrFail($id);
        $data = $request->validated();
        $data['image'] = $this->persistImage($request, $banner->image);
        if ($data['image'] === '__keep') {
            unset($data['image']);
        }
        $banner->update($data);

        return (new BannerResource($banner))
            ->additional([
                'success' => true,
                'message' => 'Banner updated successfully'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('banner_eliminar');

        $banner = Banner::findOrFail($id);
        $this->deleteImageIfExists($banner->image);
        $banner->delete();
        return response()->json([
            'success' => true,
            'message' => 'Banner deleted successfully'
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
