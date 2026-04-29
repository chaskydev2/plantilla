<?php

namespace App\Http\Requests\Contact;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'address' => 'required',
            'mobile_number' => 'nullable',
            'phone_number' => 'nullable',
            'email' => 'nullable',
            'business_hours' => 'nullable',
        ];
    }
}
