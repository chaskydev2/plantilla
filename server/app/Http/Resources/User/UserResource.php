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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->fullName ? $this->fullName : $this->name,
            'email' => $this->email,
            'deleted_id' => $this->deleted_id,
            
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
            
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'edit_profile' => $this->edit_profile,
        ];
    }
}
