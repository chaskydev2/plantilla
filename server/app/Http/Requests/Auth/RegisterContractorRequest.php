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
            'first_name.required' => 'El nombre es requerido.',
            'last_name.required' => 'El apellido es requerido.',
            'email.required' => 'El email es requerido.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'Este email ya está registrado.',
            'password.required' => 'La contraseña es requerida.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'La confirmación de contraseña no coincide.',
            'company_name.required' => 'El nombre de la empresa es requerido.',
            'license_number.required' => 'El número de licencia es requerido.',
            'license_number.unique' => 'Este número de licencia ya está registrado.',
            'service_area.required' => 'El área de servicio es requerida.',
            'country_code.size' => 'El código de país debe tener exactamente 2 caracteres.',
            'linkedin_url.url' => 'La URL de LinkedIn debe ser válida.',
            'portfolio_url.url' => 'La URL del portafolio debe ser válida.',
            'categories.*.exists' => 'Alguna de las categorías seleccionadas no existe.',
            'professions.*.exists' => 'Alguna de las profesiones seleccionadas no existe.',
        ];
    }
}
