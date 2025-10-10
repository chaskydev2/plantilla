<?php

namespace App\Http\Controllers;

use App\Models\HomeownerProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class HomeownerProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $homeownerProfiles = HomeownerProfile::with('user')->get();
        
        return response()->json([
            'data' => $homeownerProfiles,
            'success' => true
        ], Response::HTTP_OK);
    }

    public function show($userId): JsonResponse
    {
        $homeownerProfile = HomeownerProfile::with('user')->find($userId);
        
        if (!$homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Perfil no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        
        return response()->json([
            'data' => $homeownerProfile,
            'success' => true
        ], Response::HTTP_OK);
    }

    public function store(Request $request): JsonResponse
    {
        // Validar que el user_id no tenga ya un perfil
        $existingProfile = HomeownerProfile::where('user_id', $request->user_id)->first();
        if ($existingProfile) {
            return response()->json([
                'success' => false,
                'message' => 'El usuario ya tiene un perfil de propietario'
            ], Response::HTTP_CONFLICT);
        }

        $data = $request->only([
            'user_id', 'preferred_zip', 'address_line1', 'address_line2',
            'city', 'state_code', 'country_code', 'lat', 'lng'
        ]);
        
        $homeownerProfile = HomeownerProfile::create($data);
        
        return response()->json([
            'data' => $homeownerProfile->load('user'),
            'success' => true,
            'message' => 'Perfil creado correctamente'
        ], Response::HTTP_CREATED);
    }

    public function update(Request $request, $userId): JsonResponse
    {
        $homeownerProfile = HomeownerProfile::find($userId);
        
        if (!$homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Perfil no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }

        $data = $request->only([
            'preferred_zip', 'address_line1', 'address_line2',
            'city', 'state_code', 'country_code', 'lat', 'lng'
        ]);
        
        $homeownerProfile->update($data);
        
        return response()->json([
            'data' => $homeownerProfile->fresh('user'),
            'success' => true,
            'message' => 'Perfil actualizado correctamente'
        ], Response::HTTP_OK);
    }

    public function destroy($userId): JsonResponse
    {
        $homeownerProfile = HomeownerProfile::find($userId);
        
        if (!$homeownerProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Perfil no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        
        $homeownerProfile->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Perfil eliminado correctamente'
        ], Response::HTTP_OK);
    }
}