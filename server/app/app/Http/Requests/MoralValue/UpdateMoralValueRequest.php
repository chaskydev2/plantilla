<?php

namespace App\Http\Requests\MoralValue;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMoralValueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required',
            'description' =>'nullable',
        ];
    }
}
