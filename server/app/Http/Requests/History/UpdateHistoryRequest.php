<?php

namespace App\Http\Requests\History;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHistoryRequest extends FormRequest
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
            'content' => 'nullable',
            'banner1' => 'nullable',
            'banner2' => 'nullable',
            'banner3' => 'nullable',
        ];
    }
}
