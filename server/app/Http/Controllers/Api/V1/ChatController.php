<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ChatThread;
use App\Models\ChatMessage;
use App\Models\Contractor;
use App\Models\HomeownerProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    /**
     * Crear o recuperar un thread de conversación y enviar un mensaje
     * El HomeownerProfile envía mensaje al Contractor
     */
    public function sendMessage(Request $request, int $contractorId): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        // Verificar que el contractor existe
        $contractor = Contractor::find($contractorId);
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado',
            ], 404);
        }

        // Obtener el user_id autenticado (HomeownerProfile)
        $homeownerUserId = Auth::id();
        
        // Verificar que el usuario tiene un perfil de homeowner
        $homeownerProfile = HomeownerProfile::where('user_id', $homeownerUserId)->first();
        if (!$homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de propietario',
            ], 403);
        }

        DB::beginTransaction();
        try {
            // Buscar o crear el thread de conversación
            $thread = ChatThread::firstOrCreate(
                [
                    'contractor_id' => $contractor->user_id,
                    'homeowner_profile_id' => $homeownerUserId,
                ],
                [
                    'last_message_at' => now(),
                ]
            );

            // Crear el mensaje
            $message = ChatMessage::create([
                'chat_thread_id' => $thread->id,
                'sender_type' => HomeownerProfile::class,
                'sender_id' => $homeownerUserId,
                'message' => $validated['message'],
            ]);

            // Actualizar last_message_at del thread
            $thread->update(['last_message_at' => now()]);

            DB::commit();

            // Cargar relaciones
            $message->load('sender');

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente',
                'data' => [
                    'thread_id' => $thread->id,
                    'message' => $message,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener toda la conversación entre HomeownerProfile y Contractor
     */
    public function getConversation(int $contractorId): JsonResponse
    {
        $homeownerUserId = Auth::id();

        // Verificar que el contractor existe
        $contractor = Contractor::find($contractorId);
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado',
            ], 404);
        }

        // Buscar el thread de conversación
        $thread = ChatThread::with([
            'messages' => function ($query) {
                $query->with('sender')->orderBy('created_at', 'asc');
            },
            'contractor.user',
            'homeownerProfile.user'
        ])
        ->where('contractor_id',  $contractor->user_id)
        ->where('homeowner_profile_id', $homeownerUserId)
        ->first();

        if (!$thread) {
            return response()->json([
                'success' => true,
                'message' => 'No hay conversación iniciada',
                'data' => [
                    'thread' => null,
                    'messages' => [],
                ],
            ]);
        }

        // Marcar mensajes como leídos (los que no fueron enviados por el usuario actual)
        $thread->messages()
            ->where('sender_id', '!=', $homeownerUserId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Conversación obtenida correctamente',
            'data' => [
                'thread' => $thread,
                'messages' => $thread->messages,
            ],
        ]);
    }

    /**
     * Obtener todas las conversaciones del HomeownerProfile actual
     */
    public function getThreads(): JsonResponse
    {
        $homeownerUserId = Auth::id();

        $threads = ChatThread::with([
            'contractor.user',
            'latestMessage.sender'
        ])
        ->where('homeowner_profile_id', $homeownerUserId)
        ->orderBy('last_message_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Conversaciones obtenidas correctamente',
            'data' => $threads,
        ]);
    }

    /**
     * Obtener mensajes no leídos del HomeownerProfile actual
     */
    public function getUnreadCount(): JsonResponse
    {
        $homeownerUserId = Auth::id();

        $unreadCount = ChatMessage::whereHas('chatThread', function ($query) use ($homeownerUserId) {
            $query->where('homeowner_profile_id', $homeownerUserId);
        })
        ->where('sender_id', '!=', $homeownerUserId)
        ->whereNull('read_at')
        ->count();

        return response()->json([
            'success' => true,
            'message' => 'Mensajes no leídos obtenidos',
            'data' => [
                'unread_count' => $unreadCount,
            ],
        ]);
    }

    /**
     * Responder desde el Contractor al HomeownerProfile
     */
    public function contractorReply(Request $request, int $threadId): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $contractorUserId = Auth::id();

        // Verificar que el usuario es un contractor
        $contractor = Contractor::where('user_id', $contractorUserId)->first();
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de contratista',
            ], 403);
        }

        // Verificar que el thread existe y pertenece a este contractor
        $thread = ChatThread::where('id', $threadId)
            ->where('contractor_id', $contractor->id)
            ->first();

        if (!$thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada',
            ], 404);
        }

        DB::beginTransaction();
        try {
            // Crear el mensaje de respuesta
            $message = ChatMessage::create([
                'chat_thread_id' => $thread->id,
                'sender_type' => Contractor::class,
                'sender_id' => $contractor->id,
                'message' => $validated['message'],
            ]);

            // Actualizar last_message_at del thread
            $thread->update(['last_message_at' => now()]);

            DB::commit();

            // Cargar relaciones
            $message->load('sender');

            return response()->json([
                'success' => true,
                'message' => 'Respuesta enviada correctamente',
                'data' => [
                    'thread_id' => $thread->id,
                    'message' => $message,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar la respuesta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Responder como contractor a partir de un thread específico
     * Valida que el contractor autenticado sea dueño del thread
     */
    public function replyAsContractor(Request $request, int $contractorId, int $threadId): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $authUserId = Auth::id();

        // Asegurar que el usuario autenticado es el contractor indicado
        $contractor = Contractor::where('user_id', $authUserId)
            ->where('user_id', $contractorId)
            ->first();

        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para responder como este contractor',
            ], 403);
        }

        $thread = ChatThread::where('id', $threadId)
            ->where('contractor_id', $contractor->user_id)
            ->first();

        if (!$thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada para este contractor',
            ], 404);
        }

        DB::beginTransaction();
        try {
            $message = ChatMessage::create([
                'chat_thread_id' => $thread->id,
                'sender_type' => Contractor::class,
                'sender_id' => $contractor->user_id,
                'message' => $validated['message'],
            ]);

            $thread->update(['last_message_at' => now()]);

            DB::commit();

            $message->load('sender');

            return response()->json([
                'success' => true,
                'message' => 'Respuesta enviada correctamente',
                'data' => [
                    'thread_id' => $thread->id,
                    'message' => $message,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar la respuesta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener todas las conversaciones del Contractor actual
     */
    public function contractorThreads(): JsonResponse
    {
        $contractorUserId = Auth::id();

        // Verificar que el usuario es un contractor
        $contractor = Contractor::where('user_id', $contractorUserId)->first();
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de contratista',
            ], 403);
        }

        $threads = ChatThread::with([
            'homeownerProfile.user',
            'latestMessage.sender'
        ])
        ->where('contractor_id', $contractor->id)
        ->orderBy('last_message_at', 'desc')
        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Conversaciones obtenidas correctamente',
            'data' => $threads,
        ]);
    }

    /**
     * Obtener conversación específica para el Contractor
     */
    public function contractorConversation(int $threadId): JsonResponse
    {
        $contractorUserId = Auth::id();

        // Verificar que el usuario es un contractor
        $contractor = Contractor::where('user_id', $contractorUserId)->first();
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de contratista',
            ], 403);
        }

        // Buscar el thread de conversación
        $thread = ChatThread::with([
            'messages' => function ($query) {
                $query->with('sender')->orderBy('created_at', 'asc');
            },
            'contractor.user',
            'homeownerProfile.user'
        ])
        ->where('id', $threadId)
        ->where('contractor_id', $contractor->user_id)
        ->first();

        if (!$thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada',
            ], 404);
        }

        // Marcar mensajes como leídos (los que no fueron enviados por el contractor)
        $thread->messages()
            ->where('sender_id', '!=', $contractor->user_id)
            ->orWhere('sender_type', '!=', Contractor::class)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Conversación obtenida correctamente',
            'data' => [
                'thread' => $thread,
                'messages' => $thread->messages,
            ],
        ]);
    }

    /**
     * Obtener mensajes no leídos del Contractor actual
     */
    public function contractorUnreadCount(): JsonResponse
    {
        $contractorUserId = Auth::id();

        // Verificar que el usuario es un contractor
        $contractor = Contractor::where('user_id', $contractorUserId)->first();
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes un perfil de contratista',
            ], 403);
        }

        $unreadCount = ChatMessage::whereHas('chatThread', function ($query) use ($contractor) {
            $query->where('contractor_id', $contractor->user_id);
        })
        ->where(function ($query) use ($contractor) {
            $query->where('sender_id', '!=', $contractor->user_id)
                  ->orWhere('sender_type', '!=', Contractor::class);
        })
        ->whereNull('read_at')
        ->count();

        return response()->json([
            'success' => true,
            'message' => 'Mensajes no leídos obtenidos',
            'data' => [
                'unread_count' => $unreadCount,
            ],
        ]);
    }

    /**
     * Obtener todos los ChatThread de un Contractor específico
     * Incluye información del HomeownerProfile y el último mensaje
     * Con paginación
     */
    public function getContractorAllThreads(Request $request, int $contractorId): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $page = $request->query('page', 1);

        // Verificar que el contractor existe
        $contractor = Contractor::where('user_id', $contractorId)->first();
        if (!$contractor) {
            return response()->json([
                'success' => false,
                'message' => 'Contractor no encontrado',
            ], 404);
        }

        $threadsPaginated = ChatThread::with([
            'homeownerProfile.user',
            'messages' => function ($query) {
                $query->with('sender')->orderBy('created_at', 'desc')->limit(1);
            }
        ])
        ->where('contractor_id', $contractor->user_id)
        ->orderBy('last_message_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);

        $threads = $threadsPaginated->getCollection()->map(function ($thread) use ($contractor) {
            return [
                'id' => $thread->id,
                'contractor_id' => $thread->contractor_id,
                'homeowner_profile_id' => $thread->homeowner_profile_id,
                'last_message_at' => $thread->last_message_at,
                'homeowner_profile' => $thread->homeownerProfile,
                'latest_message' => $thread->messages->first(),
                'total_messages' => $thread->messages()->count(),
                'unread_count' => $thread->messages()
                    ->where('sender_id', '!=', $contractor->id)
                    ->whereNull('read_at')
                    ->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Todas las conversaciones del contractor obtenidas',
            'data' => [
                'contractor_id' => $contractorId,
                'pagination' => [
                    'total' => $threadsPaginated->total(),
                    'per_page' => $threadsPaginated->perPage(),
                    'current_page' => $threadsPaginated->currentPage(),
                    'last_page' => $threadsPaginated->lastPage(),
                    'from' => $threadsPaginated->firstItem(),
                    'to' => $threadsPaginated->lastItem(),
                    'has_more' => $threadsPaginated->hasMorePages(),
                ],
                'threads' => $threads,
            ],
        ]);
    }

    /**
     * Obtener todos los ChatThread de un HomeownerProfile específico
     * Incluye información del Contractor y el último mensaje
     * Con paginación
     */
    public function getHomeownerAllThreads(Request $request, int $homeownerId): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $page = $request->query('page', 1);

        // Verificar que el homeowner existe
        $homeowner = HomeownerProfile::where('user_id', $homeownerId)->first();
        if (!$homeowner) {
            return response()->json([
                'success' => false,
                'message' => 'HomeownerProfile no encontrado',
            ], 404);
        }

        $threadsPaginated = ChatThread::with([
            'contractor.user',
            'messages' => function ($query) {
                $query->with('sender')->orderBy('created_at', 'desc')->limit(1);
            }
        ])
        ->where('homeowner_profile_id', $homeownerId)
        ->orderBy('last_message_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);

        $threads = $threadsPaginated->getCollection()->map(function ($thread) use ($homeownerId) {
            return [
                'id' => $thread->id,
                'contractor_id' => $thread->contractor_id,
                'homeowner_profile_id' => $thread->homeowner_profile_id,
                'last_message_at' => $thread->last_message_at,
                'contractor' => $thread->contractor,
                'latest_message' => $thread->messages->first(),
                'total_messages' => $thread->messages()->count(),
                'unread_count' => $thread->messages()
                    ->where('sender_id', '!=', $homeownerId)
                    ->whereNull('read_at')
                    ->count(),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Todas las conversaciones del homeowner obtenidas',
            'data' => [
                'homeowner_profile_id' => $homeownerId,
                'pagination' => [
                    'total' => $threadsPaginated->total(),
                    'per_page' => $threadsPaginated->perPage(),
                    'current_page' => $threadsPaginated->currentPage(),
                    'last_page' => $threadsPaginated->lastPage(),
                    'from' => $threadsPaginated->firstItem(),
                    'to' => $threadsPaginated->lastItem(),
                    'has_more' => $threadsPaginated->hasMorePages(),
                ],
                'threads' => $threads,
            ],
        ]);
    }

    /**
     * Obtener todas las conversaciones con estadísticas
     * Vista administrativa
     * Con paginación
     */
    public function getAllThreadsWithStats(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 15);
        $page = $request->query('page', 1);

        $threadsPaginated = ChatThread::with([
            'contractor.user',
            'homeownerProfile.user',
            'messages' => function ($query) {
                $query->orderBy('created_at', 'desc')->limit(1);
            }
        ])
        ->orderBy('last_message_at', 'desc')
        ->paginate($perPage, ['*'], 'page', $page);

        $threads = $threadsPaginated->getCollection()->map(function ($thread) {
            $totalMessages = $thread->messages()->count();
            $unreadMessages = $thread->messages()->whereNull('read_at')->count();

            return [
                'id' => $thread->id,
                'contractor' => [
                    'id' => $thread->contractor->user_id,
                    'name' => $thread->contractor->user->name,
                    'email' => $thread->contractor->user->email,
                    'company' => $thread->contractor->company_name,
                ],
                'homeowner' => [
                    'id' => $thread->homeownerProfile->user_id,
                    'name' => $thread->homeownerProfile->user->name,
                    'email' => $thread->homeownerProfile->user->email,
                ],
                'last_message_at' => $thread->last_message_at,
                'latest_message' => $thread->messages->first(),
                'statistics' => [
                    'total_messages' => $totalMessages,
                    'unread_messages' => $unreadMessages,
                    'read_messages' => $totalMessages - $unreadMessages,
                ],
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Todas las conversaciones con estadísticas obtenidas',
            'data' => [
                'pagination' => [
                    'total' => $threadsPaginated->total(),
                    'per_page' => $threadsPaginated->perPage(),
                    'current_page' => $threadsPaginated->currentPage(),
                    'last_page' => $threadsPaginated->lastPage(),
                    'from' => $threadsPaginated->firstItem(),
                    'to' => $threadsPaginated->lastItem(),
                    'has_more' => $threadsPaginated->hasMorePages(),
                ],
                'threads' => $threads,
            ],
        ]);
    }

    /**
     * Responder como homeowner a partir de un thread específico
     * Valida que el homeowner autenticado sea dueño del thread
     */
    public function replyAsHomeowner(Request $request, int $homeownerId, int $threadId): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $authUserId = Auth::id();

        // Asegurar que el usuario autenticado es el homeowner indicado
        $homeowner = HomeownerProfile::where('user_id', $authUserId)
            ->where('user_id', $homeownerId)
            ->first();

        if (!$homeowner) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para responder como este homeowner',
            ], 403);
        }

        $thread = ChatThread::where('id', $threadId)
            ->where('homeowner_profile_id', $homeowner->user_id)
            ->first();

        if (!$thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada para este homeowner',
            ], 404);
        }

        DB::beginTransaction();
        try {
            $message = ChatMessage::create([
                'chat_thread_id' => $thread->id,
                'sender_type' => HomeownerProfile::class,
                'sender_id' => $homeowner->user_id,
                'message' => $validated['message'],
            ]);

            $thread->update(['last_message_at' => now()]);

            DB::commit();

            $message->load('sender');

            return response()->json([
                'success' => true,
                'message' => 'Respuesta enviada correctamente',
                'data' => [
                    'thread_id' => $thread->id,
                    'message' => $message,
                ],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar la respuesta: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Eliminar un mensaje específico dentro de un thread.
     */
    public function deleteMessage(int $threadId, int $messageId): JsonResponse
    {
        $thread = ChatThread::find($threadId);

        if (! $thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada',
            ], 404);
        }

        $authUserId = Auth::id();

        if (! $this->userParticipatesInThread($thread, $authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar este mensaje',
            ], 403);
        }

        $message = ChatMessage::where('chat_thread_id', $thread->id)
            ->where('id', $messageId)
            ->first();

        if (! $message) {
            return response()->json([
                'success' => false,
                'message' => 'Mensaje no encontrado',
            ], 404);
        }

        $message->delete();

        $latestMessage = $thread->messages()->latest('created_at')->first();
        $thread->update(['last_message_at' => optional($latestMessage)->created_at]);

        return response()->json([
            'success' => true,
            'message' => 'Mensaje eliminado correctamente',
        ]);
    }

    /**
     * Eliminar un thread completo junto con sus mensajes.
     */
    public function deleteThread(int $threadId): JsonResponse
    {
        $thread = ChatThread::find($threadId);

        if (! $thread) {
            return response()->json([
                'success' => false,
                'message' => 'Conversación no encontrada',
            ], 404);
        }

        $authUserId = Auth::id();

        if (! $this->userParticipatesInThread($thread, $authUserId)) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permisos para eliminar esta conversación',
            ], 403);
        }

        DB::transaction(function () use ($thread) {
            $thread->messages()->delete();
            $thread->delete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Conversación eliminada correctamente',
        ]);
    }

    /**
     * Determina si el usuario autenticado participa en el thread dado.
     */
    protected function userParticipatesInThread(ChatThread $thread, int $userId): bool
    {
        if ((int) $thread->homeowner_profile_id === $userId) {
            return true;
        }

        if ((int) $thread->contractor_id === $userId) {
            return true;
        }

        $contractor = Contractor::query()
            ->where('id', $thread->contractor_id)
            ->orWhere('user_id', $thread->contractor_id)
            ->first();

        return $contractor && (int) $contractor->user_id === $userId;
    }
}
