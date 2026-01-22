<?php

namespace App\Http\Requests\HomeownerProfileService;

use Illuminate\Foundation\Http\FormRequest;

class SyncHomeownerProfileServicesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'services' => ['required', 'array', 'min:0'],
            'services.*' => ['integer', 'exists:services,id'],
        ];
    }
}
