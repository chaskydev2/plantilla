<?php

namespace App\Http\Requests\Agreement;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'description' => 'nullable',
            'photo' => 'required',
        ];
    }
}
