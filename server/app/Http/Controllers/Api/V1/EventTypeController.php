<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventType\EventTypeResource;
use App\Models\EventType;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\EventType\EventTypeCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\EventType\StoreEventTypeRequest;
use App\Http\Requests\EventType\UpdateEventTypeRequest;
use Illuminate\Support\Facades\Gate;

class EventTypeController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('tipo_evento_listar');
        
        $query = EventType::query()
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

        return (new EventTypeCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('tipo_evento_ver');

        $eventType = EventType::findOrFail($id);

        return (new EventTypeResource($eventType))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreEventTypeRequest $request): JsonResponse
    {
        Gate::authorize('tipo_evento_crear');

        $eventType = EventType::create($request->validated());
    
        return (new EventTypeResource($eventType))
            ->additional([
                'success' => true,
                'message' => 'Tipo de evento Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateEventTypeRequest $request, $id)
    {
        Gate::authorize('tipo_evento_editar');

        $eventType = EventType::findOrFail($id);
        $eventType->update($request->validated());
        
        return (new EventTypeResource($eventType))
            ->additional([
                'success' => true,
                'message' => 'Tipo de evento actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('tipo_evento_eliminar');

        $eventType = EventType::findOrFail($id);
        $eventType->delete();
        return response()->json([
            'success' => true,
            'message' => 'Tipo de evento Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }
}
