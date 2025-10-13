<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\RegisterHomeownerRequest;
use App\Http\Resources\Auth\AuthResource;
use App\Models\User;
use App\Models\Role;
use App\Traits\Auth\AuthTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    use AuthTrait;

    public function login(AuthRequest $request): JsonResponse | AuthResource
    {
        if (!Auth::attempt($request->validated())) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ], Response::HTTP_UNAUTHORIZED);
        }
        return $this->_generateTokenAndResponse_($request->user());
    }

    public function register(RegisterUserRequest $request): JsonResponse | AuthResource
    {
        // Crear el usuario
        $userData = $request->validated();
        
        // Asegurar que la contraseña esté hasheada
        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        }
        
        $user = User::create($userData);

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

        // Autenticar automáticamente al usuario recién registrado
        Auth::login($user);

        // Retornar la respuesta con el token generado
        return $this->_generateTokenAndResponse_($user);
    }

    public function registerHomeowner(RegisterHomeownerRequest $request): JsonResponse | AuthResource
    {
        // Crear el usuario homeowner
        $userData = $request->validated();
        
        // Asegurar que la contraseña esté hasheada
        if (isset($userData['password'])) {
            $userData['password'] = Hash::make($userData['password']);
        }
        
        $user = User::create($userData);

        // Asignar rol de homeowner por defecto
        $homeownerRole = Role::where('name', 'homeowner')->first();
        if ($homeownerRole) {
            $user->syncRoles(['homeowner']);
        }

        // Cargar los roles después de asignarlos
        $user->load('roles');

        // Autenticar automáticamente al usuario recién registrado
        Auth::login($user);

        // Retornar la respuesta con el token generado
        return $this->_generateTokenAndResponse_($user);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->token()->revoke();

        return response()->json([
            'success' => true,
            'message'=>'Logged out successfully'
        ])->setStatusCode(Response::HTTP_OK);
    }

    public function me(Request $request)
    {
        return $this->_generateResponse_(Auth::user());
    }
}
