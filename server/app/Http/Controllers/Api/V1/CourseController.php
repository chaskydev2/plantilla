<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Course\CourseResource;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\Course\CourseCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\Course\StoreCourseRequest;
use App\Http\Requests\Course\UpdateCourseRequest;
use Illuminate\Support\Facades\Gate;

class CourseController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('curso_listar');
        
        $query = Course::query()
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

        return (new CourseCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('curso_ver');

        $course = Course::findOrFail($id);

        return (new CourseResource($course))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreCourseRequest $request): JsonResponse
    {
        Gate::authorize('curso_crear');

        $course = Course::create($request->validated());
    
        return (new CourseResource($course))
            ->additional([
                'success' => true,
                'message' => 'Curso Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateCourseRequest $request, $id)
    {
        Gate::authorize('curso_editar');

        $course = Course::findOrFail($id);
        $course->update($request->validated());
        
        return (new CourseResource($course))
            ->additional([
                'success' => true,
                'message' => 'Curso actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('curso_eliminar');

        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json([
            'success' => true,
            'message' => 'Curso Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        $result = Course::all();

        return (CourseResource::collection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
