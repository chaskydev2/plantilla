<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at,
            'ci' => $this->ci,
            'registration_code' => $this->registration_code,
            'address' => $this->address,
            'mobile_number' => $this->mobile_number,
            'phone_number' => $this->phone_number,
            'edit_profile' => $this->edit_profile,
            'verification' => $this->verification,
            'created_id' => $this->created_id,
            'updated_id' => $this->updated_id,
            'deleted_id' => $this->deleted_id,
            'restored_id' => $this->restored_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'restored_at' => $this->restored_at,

            // Incluir múltiples roles
            'roles' => $this->whenLoaded('roles', function () {
                return $this->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                    ];
                });
            }),
            // Mantener compatibilidad con código existente
            'role_id' => $this->whenLoaded('roles', function () {
                return $this->roles->first()?->id;
            }),
            'role_name' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name')->join(', ');
            }),
        ];
    }
}
