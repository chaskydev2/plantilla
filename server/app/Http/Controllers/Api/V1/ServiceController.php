<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Service\StoreServiceRequest;
use App\Http\Requests\Service\UpdateServiceRequest;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                    ->orWhere('slug', 'like', '%' . $search . '%');
            });
        }

        $sortBy = $request->input('sort_by', 'name');
        $sortDir = $request->input('sort_dir', 'asc');

        $services = $query
            ->orderBy($sortBy, $sortDir)
            ->paginate($request->integer('per_page', 15));

        return response()->json($services, Response::HTTP_OK);
    }

    public function store(StoreServiceRequest $request): JsonResponse
    {
        $data = $request->validated();

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);
        $iconPath = $this->persistIcon($request, null);
        $data['icon'] = $iconPath === '__keep' ? null : $iconPath;
        $imagePath = $this->persistImage($request, null);
        $data['image'] = $imagePath === '__keep' ? null : $imagePath;

        $service = Service::create($data);

        return response()->json([
            'success' => true,
            'data' => $service,
        ], Response::HTTP_CREATED);
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $service,
        ], Response::HTTP_OK);
    }

    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $data = $request->validated();
        $data['slug'] = $data['slug'] ?? ($data['name'] ?? $service->slug);

        $data['icon'] = $this->persistIcon($request, $service->icon);
        if ($data['icon'] === '__keep') {
            unset($data['icon']);
        }

        $data['image'] = $this->persistImage($request, $service->image);
        if ($data['image'] === '__keep') {
            unset($data['image']);
        }

        $service->update($data);

        return response()->json([
            'success' => true,
            'data' => $service->fresh(),
        ], Response::HTTP_OK);
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->deleteIconIfExists($service->icon);
        $this->deleteImageIfExists($service->image);
        $service->delete();

        return response()->json([
            'success' => true,
            'message' => 'Servicio eliminado correctamente',
        ], Response::HTTP_OK);
    }

    private function persistIcon(Request $request, ?string $currentPath): ?string
    {
        if ($request->boolean('remove_icon')) {
            $this->deleteIconIfExists($currentPath);
            return null;
        }

        if (!$request->hasFile('icon')) {
            return '__keep';
        }

        $file = $request->file('icon');
        if (!$file || !$file->isValid()) {
            return '__keep';
        }

        $this->deleteIconIfExists($currentPath);

        $directory = public_path('assets/services');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('service_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/services/' . $filename;
    }

    private function deleteIconIfExists(?string $path): void
    {
        if (!$path) {
            return;
        }

        $fullPath = public_path($path);
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
    }

    private function persistImage(Request $request, ?string $currentPath): ?string
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

        $directory = public_path('assets/services');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('service_image_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/services/' . $filename;
    }

    private function deleteImageIfExists(?string $path): void
    {
        if (!$path) {
            return;
        }

        $fullPath = public_path($path);
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
    }
}
