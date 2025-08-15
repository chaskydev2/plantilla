<?php

namespace App\Http\Resources\Directivity;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'position' => $this->position,
            'photo' => $this->photo,
        ];
    }
}
