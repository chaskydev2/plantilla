<?php

namespace App\Http\Requests\Contrato;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ContratoRequest extends FormRequest
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
        $contratoId = $this->route('contrato') ? $this->route('contrato')->user_id : null;

        return [
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                Rule::unique('contratos', 'user_id')->ignore($contratoId, 'user_id'),
            ],
            'preferred_zip' => 'nullable|string|max:15',
            'address_line1' => 'nullable|string|max:200',
            'address_line2' => 'nullable|string|max:200',
            'city' => 'nullable|string|max:120',
            'company_name' => 'required|string|max:255',
            'license_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('contratos', 'license_number')->ignore($contratoId, 'user_id'),
            ],
            'is_insured' => 'boolean',
            'service_area' => 'required|string|max:255',
            'average_rating' => 'numeric|between:0,5',
            'state_code' => 'nullable|string|max:10',
            'country_code' => 'nullable|string|size:2',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'mobile_number' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'has_driving_license' => 'boolean',
            'driving_license_category' => 'nullable|string|max:10',
            'linkedin_url' => 'nullable|url|max:500',
            'portfolio_url' => 'nullable|url|max:500',
            'affiliation_date' => 'nullable|date|before_or_equal:today',
            'approval_date' => 'nullable|date|before_or_equal:today|after_or_equal:affiliation_date',
            'contract_status' => [
                'required',
                Rule::in(['pendiente', 'aprobado', 'rechazado', 'suspendido']),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'user_id.required' => 'El ID del usuario es requerido.',
            'user_id.exists' => 'El usuario especificado no existe.',
            'user_id.unique' => 'Este usuario ya tiene un contrato asociado.',
            'company_name.required' => 'El nombre de la empresa es requerido.',
            'license_number.required' => 'El número de licencia es requerido.',
            'license_number.unique' => 'Este número de licencia ya está en uso.',
            'service_area.required' => 'El área de servicio es requerida.',
            'average_rating.between' => 'La calificación promedio debe estar entre 0 y 5.',
            'country_code.size' => 'El código de país debe tener exactamente 2 caracteres.',
            'lat.between' => 'La latitud debe estar entre -90 y 90.',
            'lng.between' => 'La longitud debe estar entre -180 y 180.',
            'linkedin_url.url' => 'La URL de LinkedIn debe ser válida.',
            'portfolio_url.url' => 'La URL del portafolio debe ser válida.',
            'affiliation_date.before_or_equal' => 'La fecha de afiliación no puede ser futura.',
            'approval_date.before_or_equal' => 'La fecha de aprobación no puede ser futura.',
            'approval_date.after_or_equal' => 'La fecha de aprobación debe ser posterior o igual a la fecha de afiliación.',
            'contract_status.in' => 'El estado del contrato debe ser: pendiente, aprobado, rechazado o suspendido.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'usuario',
            'preferred_zip' => 'código postal',
            'address_line1' => 'dirección línea 1',
            'address_line2' => 'dirección línea 2',
            'city' => 'ciudad',
            'company_name' => 'nombre de empresa',
            'license_number' => 'número de licencia',
            'is_insured' => 'asegurado',
            'service_area' => 'área de servicio',
            'average_rating' => 'calificación promedio',
            'state_code' => 'código de estado',
            'country_code' => 'código de país',
            'lat' => 'latitud',
            'lng' => 'longitud',
            'mobile_number' => 'número móvil',
            'phone_number' => 'número de teléfono',
            'has_driving_license' => 'tiene licencia de conducir',
            'driving_license_category' => 'categoría de licencia',
            'linkedin_url' => 'URL de LinkedIn',
            'portfolio_url' => 'URL de portafolio',
            'affiliation_date' => 'fecha de afiliación',
            'approval_date' => 'fecha de aprobación',
            'contract_status' => 'estado del contrato',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Normalizar algunos campos antes de la validación
        if ($this->has('country_code')) {
            $this->merge([
                'country_code' => strtoupper($this->country_code),
            ]);
        }

        if ($this->has('license_number')) {
            $this->merge([
                'license_number' => strtoupper(trim($this->license_number)),
            ]);
        }

        if ($this->has('driving_license_category')) {
            $this->merge([
                'driving_license_category' => strtoupper(trim($this->driving_license_category)),
            ]);
        }

        // Asegurar que los valores booleanos sean correctos
        if ($this->has('is_insured')) {
            $this->merge([
                'is_insured' => filter_var($this->is_insured, FILTER_VALIDATE_BOOLEAN),
            ]);
        }

        if ($this->has('has_driving_license')) {
            $this->merge([
                'has_driving_license' => filter_var($this->has_driving_license, FILTER_VALIDATE_BOOLEAN),
            ]);
        }
    }
}