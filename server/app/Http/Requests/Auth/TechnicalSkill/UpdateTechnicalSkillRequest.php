<?php

namespace App\Http\Requests\Auth\TechnicalSkill;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTechnicalSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'skill_type' => 'required',
            'skill_name' => 'required',
            'skill_level' => 'required',
            'description' => 'nullable|string',
        ];
    }
}
