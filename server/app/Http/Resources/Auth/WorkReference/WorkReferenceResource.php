<?php

namespace App\Http\Resources\Auth\WorkReference;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkReferenceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'reference_name' => $this->reference_name,
            'company' => $this->company,
            'position' => $this->position,
            'phone' => $this->phone,
            'email' => $this->email,
            'additional_notes' => $this->additional_notes,
        ];
    }
}
