<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\UserNotificationController as BaseUserNotificationController;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractorNotificationController extends BaseUserNotificationController
{
    // Deprecated alias controller for backward compatibility

    // Mostrar una notificación específica
    public function show(int $id, int $notificationId): JsonResponse
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }

        $notification = UserNotification::where('user_id', $user->id)->where('id', $notificationId)->first();

        if (!$notification) {
            return response()->json(['success' => false, 'message' => 'Notificación no encontrada'], 404);
        }

        return response()->json(['success' => true, 'message' => 'Notificación obtenida', 'data' => $notification]);
    }

    // Eliminar una notificación específica
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

    // Eliminar todas las notificaciones del usuario
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
