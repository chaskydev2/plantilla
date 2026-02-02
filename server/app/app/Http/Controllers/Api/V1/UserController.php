<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\User\UserResource;
use App\Models\User;
use App\Models\AttributeContractor;
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
        $user = User::withTrashed()->findOrFail($id);
        $userId = (int) $user->id;

        \DB::transaction(function () use ($user, $userId) {
            // Delete any records that reference the user but are configured as ON DELETE SET NULL
            // (we want full removal of user information)
            try { \DB::table('announcements')->where('published_by', $userId)->delete(); } catch (\Throwable $e) {}
            try { \DB::table('event_attendances')->where('user_id', $userId)->delete(); } catch (\Throwable $e) {}
            try { \DB::table('courses')->where('instructor_id', $userId)->delete(); } catch (\Throwable $e) {}

            // Contractor chat/messages where this user participated/sent messages
            // (these FKs are configured as SET NULL, so delete explicitly for full purge)
            try { \DB::table('contractor_messages')->where('sender_user_id', $userId)->delete(); } catch (\Throwable $e) {}
            try { \DB::table('contractor_message_threads')->where('participant_user_id', $userId)->delete(); } catch (\Throwable $e) {}

            // Delete Passport/OAuth artifacts (tables don't have FK constraints to users)
            try {
                $accessTokenIds = \DB::table('oauth_access_tokens')
                    ->where('user_id', $userId)
                    ->pluck('id')
                    ->all();

                if (!empty($accessTokenIds)) {
                    \DB::table('oauth_refresh_tokens')->whereIn('access_token_id', $accessTokenIds)->delete();
                }

                \DB::table('oauth_access_tokens')->where('user_id', $userId)->delete();
                \DB::table('oauth_auth_codes')->where('user_id', $userId)->delete();
                \DB::table('oauth_device_codes')->where('user_id', $userId)->delete();
            } catch (\Throwable $e) {
                // ignore if Passport tables are not present
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

            // Delete homeowner profile if exists
            try { $user->homeownerProfile()->delete(); } catch (\Throwable $e) {}

            // If contractor profile exists, detach its pivots and delete it
            try {
                $contractor = $user->contractor;
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

            // Delete API/Passport tokens relation if present (extra safety)
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
            'message' => 'User information retrieved successfully',
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
            'message' => 'Profile edit status updated',
            'data' => $user
        ]);
    }

    public function updateVerificationStatus(VerificationStatusRequest $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->verification = $request->input('verification');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Verification status updated',
            'data' => $user
        ]);
    }
    
    
}
