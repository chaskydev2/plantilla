<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Models\AttributeContractor;
use App\Models\ContractorProfession;
use App\Models\Service;
use App\Models\UserNotification;
use App\Models\ChatThread;
use App\Models\ChatMessage;
use Illuminate\Http\JsonResponse;
use App\Http\Resources\User\UserCollection;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\Pagination\PaginationRequest;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\VerificationStatusRequest;
use App\Http\Resources\Auth\ProfileResource;
use Illuminate\Support\Facades\Gate;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(PaginationRequest $request): JsonResponse
    {
        Gate::authorize('usuario_listar');

        $query = User::query()
            ->with('roles')
            ->excludeAdmin()
            ->search($request->input('search'))
            ->filterByRole($request->input('role'))
            ->when($request->has('verification'), function ($q) use ($request) {
                $q->where('verification', $request->boolean('verification'));
            })
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

        return (new UserCollection($result))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function all(): JsonResponse
    {
        Gate::authorize('usuario_listar');
        $users = User::query()->get(['id', 'first_name', 'last_name', 'name']);
        return UserResource::collection($users)
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }


    public function show($id): JsonResponse
    {
        Gate::authorize('usuario_ver');
        $user = User::with(['academicTrainings', 'workExperiences', 'technicalSkills', 'workReferences'])
            ->findOrFail($id);

        return (new ProfileResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        Gate::authorize('usuario_crear');

        $user = User::create($request->validated());

        // Manejar múltiples roles
        if ($request->has('role_ids') && is_array($request->role_ids)) {
            $roles = Role::whereIn('id', $request->role_ids)->pluck('name')->toArray();
            if (!empty($roles)) {
                $user->syncRoles($roles);
            }
        } elseif ($request->has('role_id')) {
            // Mantener compatibilidad con rol único
            $role = Role::find($request->role_id);
            if ($role) {
                $user->syncRoles([$role->name]);
            }
        }

        // Cargar los roles después de asignarlos
        $user->load('roles');

        return (new UserResource($user))
            ->additional([
                'success' => true,
                'message' => 'Usuario Creado Satisfactoriamente',
            ])
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function update(UpdateUserRequest $request, $id)
    {
        Gate::authorize('usuario_editar');

        $result = User::findOrFail($id);
        $result->update($request->validated());

        // Manejar múltiples roles
        if ($request->has('role_ids') && is_array($request->role_ids)) {
            $roles = Role::whereIn('id', $request->role_ids)->pluck('name')->toArray();
            if (!empty($roles)) {
                $result->syncRoles($roles);
            }
        } elseif ($request->has('role_id')) {
            // Mantener compatibilidad con rol único
            $role = Role::find($request->role_id);
            if ($role) {
                $result->syncRoles([$role->name]);
            }
        }

        // Cargar los roles después de actualizar
        $result->load('roles');

        return (new UserResource($result))
            ->additional([
                'success' => true,
                'message' => 'Usuario actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function destroy($id): JsonResponse
    {
        Gate::authorize('usuario_eliminar');

        $result = User::findOrFail($id);
        $result->delete();
        return response()->json([
            'success' => true,
            'message' => 'Usuario Eliminado Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function restore($id): JsonResponse
    {
        Gate::authorize('usuario_restaurar');

        $result = User::withTrashed()->findOrFail($id);
        $result->restore();
        return response()->json([
            'success' => true,
            'message' => 'Usuario Restablecido Satisfactoriamente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    /**
     * Permanently delete a user (force delete).
     */
    public function forceDelete($id): JsonResponse
    {
        // Reuse the delete permission — change to a more restrictive permission if desired
        Gate::authorize('usuario_eliminar');
        $user = User::withTrashed()->with('contractor')->findOrFail($id);

        \DB::transaction(function () use ($user) {
            $userId = $user->id;
            $contractor = $user->contractor;

            // Remove chat data where the user participated (homeowner or contractor)
            try {
                $threadQuery = ChatThread::query()
                    ->where('homeowner_profile_id', $userId)
                    ->orWhere('contractor_id', $userId);

                if ($contractor) {
                    $threadQuery->orWhere('contractor_id', $contractor->id);
                }

                $threadIds = $threadQuery->pluck('id');

                if ($threadIds->isNotEmpty()) {
                    ChatMessage::whereIn('chat_thread_id', $threadIds)->delete();
                    ChatThread::whereIn('id', $threadIds)->delete();
                }
            } catch (\Throwable $e) {
                // ignore chat cleanup errors
            }

            // Detach many-to-many relations (professions via contractor_professions)
            try {
                if (method_exists($user, 'professions')) {
                    $user->professions()->detach();
                }
            } catch (\Throwable $e) {
                // ignore if pivot table doesn't exist
            }

            // Delete related one-to-many models (these are permanently removed since they don't use SoftDeletes)
            try { $user->academicTrainings()->delete(); } catch (\Throwable $e) {}
            try { $user->workExperiences()->delete(); } catch (\Throwable $e) {}
            try { $user->technicalSkills()->delete(); } catch (\Throwable $e) {}
            try { $user->workReferences()->delete(); } catch (\Throwable $e) {}

            // Delete homeowner profile if exists (cascades to related chats via FK)
            try { $user->homeownerProfile()->delete(); } catch (\Throwable $e) {}

            // If contractor profile exists, detach its pivots and delete it
            try {
                if ($contractor) {
                    if (method_exists($contractor, 'categories')) {
                        $contractor->categories()->detach();
                    }
                    if (method_exists($contractor, 'professions')) {
                        $contractor->professions()->detach();
                    }
                    $contractor->delete();
                }
            } catch (\Throwable $e) {
                // ignore errors related to missing tables/relations
            }

            // Remove roles/permissions assignments
            try { $user->syncRoles([]); } catch (\Throwable $e) {}

            // Delete notifications
            try { UserNotification::where('user_id', $userId)->delete(); } catch (\Throwable $e) {}

            // Delete API/Passport tokens if present
            try { if (method_exists($user, 'tokens')) { $user->tokens()->delete(); } } catch (\Throwable $e) {}

            // Finally, force delete the user record
            $user->forceDelete();
        });

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado permanentemente'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function getUserInformation($id): JsonResponse
    {
        $user = User::with([
            'academicTrainings',
            'workExperiences',
            'technicalSkills',
            'workReferences',
            'contractor' // solo contractor directo
        ])->findOrFail($id);

        $atributeContractors = AttributeContractor::where('contractor_id', $user->id)
            ->with('attribute')
            ->get();

        // Unir los datos del usuario y los atributos del contractor en un solo array plano
        $merged = array_merge(
            $user->toArray(),
            ['contractor_attributes' => $atributeContractors->toArray()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Información de usuario obtenida correctamente',
            'data' => $merged
        ], Response::HTTP_OK);
    }

    public function updateEditProfileStatus(EditProfileStatusRequest $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->edit_profile = $request->input('edit_profile');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado de edición de perfil actualizado',
            'data' => $user
        ]);
    }

    public function updateVerificationStatus(VerificationStatusRequest $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $oldVerification = $user->verification;
        $user->verification = $request->input('verification');
        $user->save();

        $isHomeowner = (bool) $user->homeownerProfile()->exists();
        $homeownerProfile = $isHomeowner ? $user->homeownerProfile()->first() : null;
        $isContractor = (bool) $user->contractor()->exists();

        // Notificar solo si el usuario es contractor y pasó de no verificado -> verificado
        if ($isContractor && $user->verification && !$oldVerification) {
            UserNotification::notifyHomeownersForContractor($user->id);
        }

        return response()->json([
            'success' => true,
            'message' => 'Estado de verificación actualizado',
            'data' => $user,
            'is_homeowner' => $isHomeowner
        ]);
    }
    
    
}
