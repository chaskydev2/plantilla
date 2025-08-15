<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Event\EventResource;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Event\EventCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('evento_listar');
        
        $query = Event::query()
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

        return (new EventCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('evento_ver');

        $event = Event::findOrFail($id);

        return (new EventResource($event))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        Gate::authorize('evento_crear');

        $event = Event::create($request->validated());
    
        return (new EventResource($event))
            ->additional([
                'success' => true,
                'message' => 'Evento Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateEventRequest $request, $id)
    {
        Gate::authorize('evento_editar');

        $event = Event::findOrFail($id);
        $event->update($request->validated());
        
        return (new EventResource($event))
            ->additional([
                'success' => true,
                'message' => 'Evento actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('evento_eliminar');

        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json([
            'success' => true,
            'message' => 'Evento Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(Request $request): JsonResponse
    {
        $query = Event::query();

        if ($request->has('event_type_id')) {
            $query->where('event_type_id', $request->input('type'));
        }

        $result = $query->get();

        return (EventResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
