<?php

namespace App\Http\Requests\EventType;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventTypeRequest extends FormRequest
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
        ];
    }
}
