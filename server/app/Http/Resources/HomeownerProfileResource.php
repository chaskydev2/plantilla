<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HomeownerProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'preferred_zip' => $this->preferred_zip,
            'address_line1' => $this->address_line1,
            'address_line2' => $this->address_line2,
            'city' => $this->city,
            'state_code' => $this->state_code,
            'country_code' => $this->country_code,
            'lat' => $this->lat ? (float) $this->lat : null,
            'lng' => $this->lng ? (float) $this->lng : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            
            // Incluir información del usuario si está cargada
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'first_name' => $this->user->first_name,
                    'last_name' => $this->user->last_name,
                ];
            }),
        ];
    }
}
