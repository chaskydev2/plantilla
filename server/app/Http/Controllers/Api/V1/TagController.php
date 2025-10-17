<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\Tag\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Tag\TagCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Tag\StoreTagRequest;
use App\Http\Requests\Tag\UpdateTagRequest;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(PaginationRequest $request): JsonResponse
    {
        $query = Tag::query()
            ->search($request->input('search'))
            ->sort(
                $request->input('sortBy.sort', 'name'),
                $request->input('sortBy.order', 'asc')
            );

        $result = $query->paginate(
            $request->input('limit', 10),
            ['*'],
            'page',
            $request->input('page', 1)
        );

        return (new TagCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request): JsonResponse
    {
        $tag = Tag::create($request->validated());

        return (new TagResource($tag))
            ->additional([
                'success' => true,
                'message' => 'Etiqueta creada satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        $tag = Tag::findOrFail($id);

        return (new TagResource($tag))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, $id): JsonResponse
    {
        $tag = Tag::findOrFail($id);
        $tag->update($request->validated());

        return (new TagResource($tag))
            ->additional([
                'success' => true,
                'message' => 'Etiqueta actualizada satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();

        return response()->json([
            'success' => true,
            'message' => 'Etiqueta eliminada satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Get all tags without pagination.
     */
    public function all(Request $request): JsonResponse
    {
        $query = Tag::query()
            ->search($request->input('search'))
            ->sort('name', 'asc');

        $tags = $query->get();

        return (TagResource::collection($tags))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
