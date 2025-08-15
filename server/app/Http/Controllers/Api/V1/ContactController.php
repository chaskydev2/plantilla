<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Contact\ContactResource;
use App\Models\Contact;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Contact\ContactCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Contact\StoreContactRequest;
use App\Http\Requests\Contact\UpdateContactRequest;
use Illuminate\Support\Facades\Gate;

class ContactController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('contacto_listar');

        $query = Contact::query()
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

        return (new ContactCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('contacto_ver');

        $contact = Contact::findOrFail($id);

        return (new ContactResource($contact))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreContactRequest $request): JsonResponse
    {
        Gate::authorize('contacto_crear');

        $contact = Contact::create($request->validated());

        return (new ContactResource($contact))
            ->additional([
                'success' => true,
                'message' => 'Contacto Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateContactRequest $request, $id)
    {
        Gate::authorize('contacto_editar');

        $contact = contact::findOrFail($id);
        $contact->update($request->validated());

        return (new ContactResource($contact))
            ->additional([
                'success' => true,
                'message' => 'Contacto actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('contacto_eliminar');

        $contact = Contact::findOrFail($id);
        $contact->delete();
        return response()->json([
            'success' => true,
            'message' => 'Contacto Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Contact::all();

        return (ContactResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
