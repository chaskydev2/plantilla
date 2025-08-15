<?php

namespace App\Http\Resources\Beginning;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BeginningResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
        'id' => $this->id,
        'mission'=>$this->mission,
        'vision'=>$this->vision,
        'our_father'=>$this->our_father,
        ];
    }
}
