<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePersonalInformationRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Traits\Auth\AuthTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class ProfileController extends Controller
{
    use AuthTrait;

    public function profile(Request $request)
    {
        return $this->_generateProfileResponse_(Auth::user());
    }

    public function update(UpdateProfileRequest $request, $id)
    {
        if (Auth::id() != $id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado para actualizar este perfil'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $result = User::findOrFail($id);
        $validatedData = $request->validated();
        $validatedData['edit_profile'] = false;
        $result->update($validatedData);

        return ($this->_generateProfileResponse_($result))
            ->additional([
                'success' => true,
                'message' => 'Perfil actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }

    public function updatePersonalInformation(UpdatePersonalInformationRequest $request, $id)
    {
        if (Auth::id() != $id) {
            return response()->json([
                'success' => false,
                'message' => 'No autorizado para actualizar este perfil'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $result = User::findOrFail($id);
        $validatedData = $request->validated();
        $validatedData['edit_profile'] = false;
        $result->update($validatedData);

        return ($this->_generateProfileResponse_($result))
            ->additional([
                'success' => true,
                'message' => 'Perfil actualizado Satisfactoriamente'
            ])
            ->response()
            ->setStatusCode(Response::HTTP_OK);
    }
}
