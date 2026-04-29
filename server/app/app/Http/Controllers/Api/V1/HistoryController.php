<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\History\HistoryResource;
use App\Models\History;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\History\HistoryCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\History\StoreHistoryRequest;
use App\Http\Requests\History\UpdateHistoryRequest;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\File;

class HistoryController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('historia_listar');

        $query = History::query()
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

        return (new HistoryCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('historia_ver');

        $history = History::findOrFail($id);

        return (new HistoryResource($history))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreHistoryRequest $request): JsonResponse
    {
        Gate::authorize('historia_crear');
        $data = $request->validated();

        // Asegurar que exista el directorio public/assets/histories
        $this->ensureHistoryAssetsDir();

        // Procesar banners como en ServiceController (guardar en public/assets)
        foreach (['banner1', 'banner2', 'banner3'] as $field) {
            $result = $this->persistBanner($request, null, $field);
            $data[$field] = $result === '__keep' ? null : $result; // En create, si no hay archivo, setear null
        }

        $history = History::create($data);

        return (new HistoryResource($history))
            ->additional([
                'success' => true,
                'message' => 'History created successfully',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateHistoryRequest $request, $id)
    {
        Gate::authorize('historia_editar');

        $history = History::findOrFail($id);
        $data = $request->validated();

        // Asegurar que exista el directorio public/assets/histories
        $this->ensureHistoryAssetsDir();

        foreach (['banner1', 'banner2', 'banner3'] as $field) {
            $current = $history->{$field};
            $result = $this->persistBanner($request, $current, $field);
            if ($result === '__keep') {
                unset($data[$field]); // Mantener valor actual
            } else {
                $data[$field] = $result; // Puede ser nuevo path o null si se eliminó
            }
        }

        $history->update($data);

        return (new HistoryResource($history))
            ->additional([
                'success' => true,
                'message' => 'History updated successfully'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Guardar/actualizar un banner al estilo ServiceController.
     * Devuelve path relativo (assets/histories/...) | null si se elimina | '__keep' si no cambia
     */
    private function persistBanner($request, ?string $currentPath, string $field): ?string
    {
        // Eliminar explícitamente
        $removeFlag = 'remove_' . $field;
        if ($request->boolean($removeFlag)) {
            $this->deleteBannerIfExists($currentPath);
            return null;
        }

        // Si no viene archivo, mantener
        if (!$request->hasFile($field)) {
            return '__keep';
        }

        $file = $request->file($field);
        if (!$file || !$file->isValid()) {
            return '__keep';
        }

        // Reemplazar: borrar el anterior si existe
        $this->deleteBannerIfExists($currentPath);

        $directory = public_path('assets/histories');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $filename = uniqid('history_') . '.' . $file->getClientOriginalExtension();
        $file->move($directory, $filename);

        return 'assets/histories/' . $filename;
    }

    private function deleteBannerIfExists(?string $path): void
    {
        if (!$path) {
            return;
        }
        $fullPath = public_path($path);
        if (File::exists($fullPath)) {
            @File::delete($fullPath);
        }
    }

    /**
     * Crea el directorio public/assets/histories si no existe.
     */
    private function ensureHistoryAssetsDir(): void
    {
        $directory = public_path('assets/histories');
        if (!File::isDirectory($directory)) {
            File::makeDirectory($directory, 0755, true);
        }
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('historia_eliminar');

        $history = History::findOrFail($id);
        $history->delete();
        return response()->json([
            'success' => true,
            'message' => 'History deleted successfully'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = History::all();

        return (HistoryResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
