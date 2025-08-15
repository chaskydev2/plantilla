<?php

namespace App\Traits\Auth;

use App\Http\Resources\Auth\AuthResource;
use App\Http\Resources\Auth\MeResource;
use App\Http\Resources\Auth\ProfileResource;

trait AuthTrait
{
    private function _generateTokenAndResponse_($user)
    {
        $tokenResult = $user->createToken('PersonalAccessToken');
        $token = $tokenResult->token;
        $token->save();


        return new AuthResource((object)[
            'access_token' => $tokenResult->accessToken,
            'expires_at' => $token->expires_at,
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray()
        ]);
    }

    private function _generateResponse_($user)
    {
         return new MeResource((object)[
            'user' => $user,
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray()
        ]);
    }

    private function _generateProfileResponse_($user)
    {
         return new ProfileResource($user);
    }
}
