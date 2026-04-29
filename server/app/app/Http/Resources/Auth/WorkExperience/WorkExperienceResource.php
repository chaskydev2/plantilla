<?php

namespace App\Http\Resources\Auth\WorkExperience;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WorkExperienceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'company_name' => $this->company_name,
            'company_location' => $this->company_location,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'position' => $this->position,
            'responsibilities' => $this->responsibilities,
        ];
    }
}
