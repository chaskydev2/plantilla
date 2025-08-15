<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Faq\FaqResource;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Faq\FaqCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Faq\StoreFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use Illuminate\Support\Facades\Gate;

class FaqController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('pregunta_frecuente_listar');

        $query = Faq::query()
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

        return (new FaqCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('pregunta_frecuente_ver');

        $faq = Faq::findOrFail($id);

        return (new FaqResource($faq))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        Gate::authorize('pregunta_frecuente_crear');

        $faq = Faq::create($request->validated());

        return (new FaqResource($faq))
            ->additional([
                'success' => true,
                'message' => 'Preguntas frecuentes Creados Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateFaqRequest $request, $id)
    {
        Gate::authorize('pregunta_frecuente_editar');

        $faq = Faq::findOrFail($id);
        $faq->update($request->validated());

        return (new FaqResource($faq))
            ->additional([
                'success' => true,
                'message' => 'preguntas frecuentes actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('pregunta_frecuente_eliminar');

        $faq = Faq::findOrFail($id);
        $faq->delete();
        return response()->json([
            'success' => true,
            'message' => 'Preguntas frecuentes Eliminados Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Faq::all();

        return (FaqResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
