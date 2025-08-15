<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Announcement\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Announcement\AnnouncementCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Announcement\StoreAnnouncementRequest;
use App\Http\Requests\Announcement\UpdateAnnouncementRequest;
use Illuminate\Support\Facades\Gate;

class AnnouncementController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('comunicado_listar');
        
        $query = Announcement::query()
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

        return (new AnnouncementCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('comunicado_ver');

        $announcement = Announcement::findOrFail($id);

        return (new AnnouncementResource($announcement))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreAnnouncementRequest $request): JsonResponse
    {
        Gate::authorize('comunicado_crear');

        $announcement = Announcement::create($request->validated());
    
        return (new AnnouncementResource($announcement))
            ->additional([
                'success' => true,
                'message' => 'Comunicado Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateAnnouncementRequest $request, $id)
    {
        Gate::authorize('comunicado_editar');

        $announcement = Announcement::findOrFail($id);
        $announcement->update($request->validated());
        
        return (new AnnouncementResource($announcement))
            ->additional([
                'success' => true,
                'message' => 'Comunicado actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('comunicado_eliminar');

        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
        return response()->json([
            'success' => true,
            'message' => 'Comunicado Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(Request $request): JsonResponse
    {
        $query = Announcement::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        $result = $query->get();

        return (AnnouncementResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
