<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Newsletter\NewsletterResource;
use App\Models\Newsletter;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Newsletter\NewsletterCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use Illuminate\Support\Facades\Gate;
use App\Http\Requests\Newsletter\StoreNewsletterRequest;
use App\Http\Requests\Newsletter\UpdateNewsletterRequest;

class NewsletterController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('consulta_listar');

        $query = Newsletter::query()
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

        return (new NewsletterCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('consulta_ver');

        $newsletter = Newsletter::findOrFail($id);

        return (new NewsletterResource($newsletter))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreNewsletterRequest $request): JsonResponse
    {
        Gate::authorize('consulta_crear');

        $newsletter = Newsletter::create($request->validated());

        return (new NewsletterResource($newsletter))
            ->additional([
                'success' => true,
                'message' => 'Consulta creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateNewsletterRequest $request, $id)
    {
        Gate::authorize('consulta_editar');

        $newsletter = Newsletter::findOrFail($id);
        $newsletter->update($request->validated());

        return (new NewsletterResource($newsletter))
            ->additional([
                'success' => true,
                'message' => 'Consulta actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('consulta_eliminar');

        $newsletter = Newsletter::findOrFail($id);
        $newsletter->delete();
        return response()->json([
            'success' => true,
            'message' => 'Consulta eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function send(StoreNewsletterRequest $request): JsonResponse
    {
        $newsletter = Newsletter::create($request->validated());

        return (new NewsletterResource($newsletter))
            ->additional([
                'success' => true,
                'message' => 'Consulta creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
