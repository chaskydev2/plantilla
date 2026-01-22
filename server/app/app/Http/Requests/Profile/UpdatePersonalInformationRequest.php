<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePersonalInformationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
         return [
            'address' => ['nullable', 'string', 'max:255'],
            'ci' => ['required', 'string', 'max:20'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'portfolio_url' => ['nullable', 'url', 'max:255'],
            'professional_summary' => ['nullable', 'string', 'max:2000'],
            'travel_availability' => ['required', 'boolean'],
            'has_driving_license' => ['required', 'boolean'],
            'driving_license_category' => [
                'nullable',
                'string',
                'max:50',
                Rule::requiredIf($this->has_driving_license)
            ],
        ];
    }
}
