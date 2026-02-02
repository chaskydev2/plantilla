<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Contractor;
use App\Models\ContractorMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractorMessageController extends Controller
{
    /**
     * Devuelve toda la conversación de un contractor (sus mensajes),
     * opcionalmente filtrada por sender_user_id o guest_email.
     */
    public function index(Request $request, int $id): JsonResponse
    {
        $contractor = Contractor::find($id);

        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado',
                'data' => [],
            ], 404);
        }

        $validated = $request->validate([
            'sender_user_id' => 'nullable|integer|exists:users,id',
            'guest_email' => 'nullable|email|max:255',
            'status' => 'nullable|string|max:50',
        ]);

        $query = ContractorMessage::with('senderUser')
            ->where('contractor_user_id', $contractor->user_id)
            ->orderBy('created_at', 'asc');

        if (!empty($validated['sender_user_id'])) {
            $query->where('sender_user_id', $validated['sender_user_id']);
        }

        if (!empty($validated['guest_email'])) {
            $query->where('guest_email', $validated['guest_email']);
        }

        if (!empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        $messages = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Conversación obtenida correctamente',
            'data' => $messages,
        ]);
    }

    /**
     * Envía un mensaje a un contractor específico por su user_id.
     */
    public function store(Request $request, int $id): JsonResponse
    {
        // Verificar que el contractor exista
        $contractor = Contractor::find($id);

        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado',
                'data' => null,
            ], 404);
        }

        $validated = $request->validate([
            'sender_type' => 'nullable|string|max:50',
            'sender_user_id' => 'nullable|integer|exists:users,id',
            'guest_name' => 'nullable|string|max:255',
            'guest_email' => 'nullable|email|max:255',
            'message' => 'nullable|string',
            'attachments' => 'nullable|array',
            'attachments.*' => 'nullable|string',
            'links' => 'nullable|array',
            'links.*' => 'nullable|string',
            'status' => 'nullable|string|max:50',
        ]);

        // Asegurar un sender_type por defecto
        if (empty($validated['sender_type'])) {
            $validated['sender_type'] = $validated['sender_user_id'] ? 'user' : 'guest';
        }

        // Crear el mensaje
        $message = ContractorMessage::create([
            'contractor_user_id' => $contractor->user_id,
            'sender_type' => $validated['sender_type'] ?? 'guest',
            'sender_user_id' => $validated['sender_user_id'] ?? null,
            'guest_name' => $validated['guest_name'] ?? null,
            'guest_email' => $validated['guest_email'] ?? null,
            'message' => $validated['message'] ?? null,
            'attachments' => $validated['attachments'] ?? null,
            'links' => $validated['links'] ?? null,
            'status' => $validated['status'] ?? 'sent',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Mensaje enviado correctamente al contractor',
            'data' => $message,
        ], 201);
    }
}
