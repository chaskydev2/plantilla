<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterContractorRequest extends FormRequest
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
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            
            // Campos para contractor (obligatorios según la base de datos)
            'company_name' => 'nullable|string|max:255',
            'license_number' => 'nullable|string|max:255|unique:contractors,license_number',
            'service_area' => 'required|string|max:255',
            
            // Campos opcionales
            'preferred_zip' => 'nullable|string|max:15',
            'address_line1' => 'nullable|string|max:200',
            'address_line2' => 'nullable|string|max:200',
            'city' => 'nullable|string|max:120',
            'state_code' => 'nullable|string|max:10',
            'country_code' => 'nullable|string|size:2',
            'is_insured' => 'nullable|boolean',
            'mobile_number' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'has_driving_license' => 'nullable|boolean',
            'driving_license_category' => 'nullable|string|max:10',
            'linkedin_url' => 'nullable|url|max:500',
            'portfolio_url' => 'nullable|url|max:500',
            
            // Arrays de relaciones
            'categories' => 'nullable|array',
            'professions' => 'nullable|array',
        ];
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'company_name.required' => 'Company name is required.',
            'license_number.required' => 'License number is required.',
            'license_number.unique' => 'This license number is already registered.',
            'service_area.required' => 'Service area is required.',
            'country_code.size' => 'Country code must be exactly 2 characters.',
            'linkedin_url.url' => 'LinkedIn URL must be valid.',
            'portfolio_url.url' => 'Portfolio URL must be valid.',
            'categories.*.exists' => 'One or more selected categories do not exist.',
            'professions.*.exists' => 'One or more selected professions do not exist.',
        ];
    }
}
