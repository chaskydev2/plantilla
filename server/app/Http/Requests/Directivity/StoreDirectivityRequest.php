<?php

namespace App\Http\Requests\Directivity;

use Illuminate\Foundation\Http\FormRequest;

class StoreDirectivityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'position' => 'nullable',
            'photo' => 'nullable',
        ];
    }
}
