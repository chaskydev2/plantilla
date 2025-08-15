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
            'role_id' => $this->roles()->first()?->id,
            'role_name' => $this->roles()->first()?->name,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'edit_profile' => $this->edit_profile,
        ];
    }
}
