<?php

namespace App\Http\Requests\Requirement;

use Illuminate\Foundation\Http\FormRequest;

class StoreRequirementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required',
            'description' => 'nullable',
            'type' => 'required',
            'order' => 'required',
        ];
    }
}
