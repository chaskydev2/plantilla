<?php

namespace App\Http\Requests\Service;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('services', 'name')],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('services', 'slug')],
            'icon' => ['nullable'],
            'image' => ['nullable'],
            'description' => ['nullable', 'string'],
        ];
    }
}
