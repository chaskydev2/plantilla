<?php

namespace App\Http\Requests\HomeownerProfile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateHomeownerProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'preferred_zip' => 'nullable|string|max:15',
            'address_line1' => 'nullable|string|max:200',
            'address_line2' => 'nullable|string|max:200',
            'city' => 'nullable|string|max:120',
            'state_code' => 'nullable|string|max:10',
            'country_code' => 'nullable|string|size:2|in:US,BO,AR,BR,PE,CL,CO,EC,UY,PY,VE',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'preferred_zip' => 'preferred postal code',
            'address_line1' => 'address line 1',
            'address_line2' => 'address line 2',
            'city' => 'city',
            'state_code' => 'state code',
            'country_code' => 'country code',
            'lat' => 'latitude',
            'lng' => 'longitude',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'country_code.in' => 'The country code must be valid.',
            'lat.between' => 'Latitude must be between -90 and 90.',
            'lng.between' => 'Longitude must be between -180 and 180.',
        ];
    }
}
