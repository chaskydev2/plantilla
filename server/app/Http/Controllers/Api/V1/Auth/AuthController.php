<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Http\Requests\Auth\RegisterHomeownerRequest;
use App\Http\Requests\Auth\RegisterContractorRequest;
use App\Http\Resources\Auth\AuthResource;
use App\Models\User;
use App\Http\Resources\Role\RoleCollection;
use App\Http\Resources\Role\RoleResource;
use Spatie\Permission\Models\Role;
use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Models\HomeownerProfile;
use App\Models\Contractor;
use App\Traits\Auth\AuthTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
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

        // Crear el perfil de homeowner con datos por defecto
        HomeownerProfile::create([
            'user_id' => $user->id,
            'country_code' => 'US',
            // Los demás campos quedan como null por defecto
        ]);

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

    public function registerContractor(RegisterContractorRequest $request): JsonResponse | AuthResource
    {
        try {
            return DB::transaction(function () use ($request) {
                // Crear el usuario contractor
                $userData = $request->only(['first_name', 'last_name', 'email', 'password', 'phone']);
                
                // Asegurar que la contraseña esté hasheada
                if (isset($userData['password'])) {
                    $userData['password'] = Hash::make($userData['password']);
                }
                
                $user = User::create($userData);

                // Crear el perfil de contractor con campos obligatorios
                $contractorData = [
                    'user_id' => $user->id,
                    // Campos obligatorios con valores por defecto si están vacíos
                    'company_name' => $request->input('company_name') ?: 'Sin especificar',
                    'license_number' => $request->input('license_number') ?: $this->generateLicenseNumber(),
                    'service_area' => $request->input('service_area') ?: 'General',
                    
                    // Campos con valores por defecto
                    'country_code' => $request->input('country_code', 'BO'),
                    'contract_status' => Contractor::STATUS_PENDING,
                    'affiliation_date' => now()->toDateString(),
                    'is_insured' => $request->boolean('is_insured', false),
                    'has_driving_license' => $request->boolean('has_driving_license', false),
                    'average_rating' => 0.00,
                ];

                // Agregar campos opcionales si están presentes
                $optionalFields = [
                    'preferred_zip', 'address_line1', 'address_line2', 'city', 'state_code',
                    'mobile_number', 'phone_number', 'driving_license_category',
                    'linkedin_url', 'portfolio_url'
                ];

                foreach ($optionalFields as $field) {
                    if ($request->filled($field)) {
                        $contractorData[$field] = $request->input($field);
                    }
                }
                
                $contractor = Contractor::create($contractorData);

                // TODO: Habilitar cuando existan las tablas pivot
                // Asociar categorías si existen
                // if ($request->has('categories') && is_array($request->categories)) {
                //     $contractor->categories()->attach($request->categories);
                // }

                // Asociar profesiones si existen
                // if ($request->has('professions') && is_array($request->professions)) {
                //     $contractor->professions()->attach($request->professions);
                // }

                // Asignar rol de contractor por defecto
                $contractorRole = Role::where('name', 'contractor')->first();
                if ($contractorRole) {
                    $user->syncRoles(['contractor']);
                }

                // Cargar los roles después de asignarlos
                $user->load('roles');

                // Autenticar automáticamente al usuario recién registrado
                Auth::login($user);

                // Retornar la respuesta con el token generado
                return $this->_generateTokenAndResponse_($user);
            });
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar el contractor: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
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

    /**
     * Generate a unique license number for contractors
     */
    private function generateLicenseNumber(): string
    {
        do {
            $licenseNumber = 'LIC-' . date('Y') . '-' . strtoupper(substr(uniqid(), -8));
        } while (Contractor::where('license_number', $licenseNumber)->exists());
        
        return $licenseNumber;
    }
}
