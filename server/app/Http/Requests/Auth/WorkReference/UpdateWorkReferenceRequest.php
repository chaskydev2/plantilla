<?php

namespace App\Http\Requests\Auth\WorkReference;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWorkReferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reference_name' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'nullable|string|email',
            'additional_notes' => 'nullable|string',
        ];
    }
}
