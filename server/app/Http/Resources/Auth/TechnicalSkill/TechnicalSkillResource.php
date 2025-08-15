<?php

namespace App\Http\Resources\Auth\TechnicalSkill;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TechnicalSkillResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'skill_type' => $this->skill_type,
            'skill_name' => $this->skill_name,
            'skill_level' => $this->skill_level,
            'description' => $this->description,
        ];
    }
}
