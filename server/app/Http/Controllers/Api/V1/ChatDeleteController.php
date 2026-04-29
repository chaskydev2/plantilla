<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChatThread;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatDeleteController extends Controller
{
    public function deleteMessage(int $threadId, int $messageId): JsonResponse
    {
        $userId = Auth::id();

        $thread = ChatThread::where('id', $threadId)->first();
        if (! $thread) {
            return response()->json(['success' => false, 'message' => 'Conversación no encontrada'], 404);
        }

        if ($thread->contractor_id != $userId && $thread->homeowner_profile_id != $userId) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para eliminar este mensaje'], 403);
        }

        $message = ChatMessage::where('id', $messageId)->where('chat_thread_id', $threadId)->first();
        if (! $message) {
            return response()->json(['success' => false, 'message' => 'Mensaje no encontrado'], 404);
        }

        $message->delete();

        return response()->json(['success' => true, 'message' => 'Mensaje eliminado correctamente']);
    }

    public function deleteThread(int $threadId): JsonResponse
    {
        $userId = Auth::id();

        $thread = ChatThread::where('id', $threadId)->first();
        if (! $thread) {
            return response()->json(['success' => false, 'message' => 'Conversación no encontrada'], 404);
        }

        if ($thread->contractor_id != $userId && $thread->homeowner_profile_id != $userId) {
            return response()->json(['success' => false, 'message' => 'No tienes permisos para eliminar esta conversación'], 403);
        }

        DB::transaction(function () use ($thread) {
            try {
                $thread->messages()->delete();
            } catch (\Throwable $e) {
                // ignore missing relation
            }
            $thread->delete();
        });

        return response()->json(['success' => true, 'message' => 'Conversación eliminada correctamente']);
    }
}
