<?php

namespace App\Http\Requests\Agreement;

use Illuminate\Foundation\Http\FormRequest;

class StoreAgreementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'descripcion' => 'nullable',
            'photo' => 'required',
        ];
    }
}
