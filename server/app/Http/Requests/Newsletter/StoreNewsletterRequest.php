<?php

namespace App\Http\Requests\Newsletter;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsletterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required',
            'subject' => 'required',
            'content' => 'nullable',
        ];
    }
}
