<?php

namespace App\Http\Requests\Beginning;

use Illuminate\Foundation\Http\FormRequest;

class StoreBeginningRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mission' => 'required',
            'vision' => 'required',
            'our_father' => 'required',
        ];
    }
}
