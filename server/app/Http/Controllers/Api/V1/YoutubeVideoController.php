<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\YoutubeVideo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class YoutubeVideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = YoutubeVideo::query();

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        if ($request->filled('topic')) {
            $query->where('topic', 'like', '%' . $request->input('topic') . '%');
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->input('search') . '%')
                  ->orWhere('description', 'like', '%' . $request->input('search') . '%');
            });
        }

        $videos = $query->orderByDesc('created_at')->paginate($request->integer('per_page', 15));

        return response()->json($videos, Response::HTTP_OK);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'youtube_url' => 'required|url|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'topic' => 'nullable|string|max:100',
        ]);

        $video = YoutubeVideo::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Video de YouTube creado correctamente',
            'data' => $video,
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(YoutubeVideo $youtubeVideo): JsonResponse
    {
        // Incrementar vistas
        $youtubeVideo->increment('views');

        return response()->json([
            'success' => true,
            'data' => $youtubeVideo,
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, YoutubeVideo $youtubeVideo): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'youtube_url' => 'nullable|url|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'topic' => 'nullable|string|max:100',
        ]);

        $youtubeVideo->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Video de YouTube actualizado correctamente',
            'data' => $youtubeVideo,
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(YoutubeVideo $youtubeVideo): JsonResponse
    {
        $youtubeVideo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Video de YouTube eliminado correctamente',
        ], Response::HTTP_OK);
    }
}

