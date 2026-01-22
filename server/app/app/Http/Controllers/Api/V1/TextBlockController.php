<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\TextBlock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TextBlockController extends Controller
{
    public function index(): JsonResponse
    {
        $blocks = TextBlock::orderByDesc('created_at')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $blocks,
        ], Response::HTTP_OK);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'text_primary' => 'required|string',
            'text_secondary' => 'required|string',
            'text_tertiary' => 'required|string',
        ]);

        $block = TextBlock::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Text block creado correctamente',
            'data' => $block,
        ], Response::HTTP_CREATED);
    }

    public function show(TextBlock $textBlock): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $textBlock,
        ], Response::HTTP_OK);
    }

    public function update(Request $request, TextBlock $textBlock): JsonResponse
    {
        $data = $request->validate([
            'text_primary' => 'sometimes|required|string',
            'text_secondary' => 'sometimes|required|string',
            'text_tertiary' => 'sometimes|required|string',
        ]);

        $textBlock->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Text block actualizado correctamente',
            'data' => $textBlock,
        ], Response::HTTP_OK);
    }

    public function destroy(TextBlock $textBlock): JsonResponse
    {
        $textBlock->delete();

        return response()->json([
            'success' => true,
            'message' => 'Text block eliminado correctamente',
        ], Response::HTTP_OK);
    }
}
