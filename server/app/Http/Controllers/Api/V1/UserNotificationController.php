<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserNotificationController extends Controller
{
    public function index(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado', 'data' => []], 404);
        }

        $query = UserNotification::where('user_id', $user->id)->orderByDesc('created_at');

        // Filters
        if ($request->filled('unread')) {
            $query->whereNull('read_at');
        }

        if ($request->filled('read')) {
            $query->whereNotNull('read_at');
        }

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('message', 'like', "%{$search}%")
                    ->orWhereJsonContains('data', $search);
            });
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        // Pagination
        $perPage = (int) $request->input('per_page', 15);
        $notifications = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Notificaciones obtenidas',
            'data' => $notifications->items(),
            'meta' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    public function store(Request $request, int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado', 'data' => null], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'message' => 'nullable|string',
            'url' => 'nullable|url|max:2048',
            'data' => 'nullable|array',
        ]);

        $notification = UserNotification::create([
            'user_id' => $user->id,
            'title' => $validated['title'] ?? null,
            'message' => $validated['message'] ?? null,
            'url' => $validated['url'] ?? null,
            'data' => $validated['data'] ?? null,
        ]);

        return response()->json(['success' => true, 'message' => 'Notificación creada', 'data' => $notification], 201);
    }

    public function markRead(int $id, int $notificationId): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        $notification = UserNotification::where('user_id', $user->id)->where('id', $notificationId)->first();

        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada'], 404);
        }

        $notification->markAsRead();

        return response()->json(['success' => true, 'message' => 'Notificación marcada como leída', 'data' => $notification]);
    }

    public function markAllRead(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        UserNotification::where('user_id', $user->id)->whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['success' => true, 'message' => 'Todas las notificaciones marcadas como leídas']);
    }

    public function destroy(int $id, int $notificationId): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        $notification = UserNotification::where('user_id', $user->id)->where('id', $notificationId)->first();

        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada'], 404);
        }

        $notification->delete();

        return response()->json(['success' => true, 'message' => 'Notificación eliminada']);
    }

    public function destroyAll(int $id): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        UserNotification::where('user_id', $user->id)->delete();

        return response()->json(['success' => true, 'message' => 'Todas las notificaciones eliminadas']);
    }
}
