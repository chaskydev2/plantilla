<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\AuthRequest;
use App\Http\Resources\Auth\AuthResource;
use App\Traits\Auth\AuthTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
