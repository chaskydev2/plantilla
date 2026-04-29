<?php

namespace App\Http\Requests\Contractor;

use App\Models\Contractor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContractorRequest extends FormRequest
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
            'user_id' => ['required', 'integer', 'exists:users,id', 'unique:contractors,user_id'],
            'preferred_zip' => ['nullable', 'string', 'max:15'],
            'address_line1' => ['nullable', 'string', 'max:200'],
            'address_line2' => ['nullable', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:120'],
            'company_name' => ['required', 'string', 'max:255'],
            'license_number' => ['required', 'string', 'max:255', 'unique:contractors,license_number'],
            'is_insured' => ['boolean'],
            'service_area' => ['required', 'string', 'max:255'],
            'average_rating' => ['numeric', 'min:0', 'max:5'],
            'state_code' => ['nullable', 'string', 'max:10'],
            'country_code' => ['string', 'size:2'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'mobile_number' => ['nullable', 'string', 'max:20'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'has_driving_license' => ['boolean'],
            'driving_license_category' => ['nullable', 'string', 'max:10'],
            'linkedin_url' => ['nullable', 'url', 'max:500'],
            'portfolio_url' => ['nullable', 'url', 'max:500'],
            'affiliation_date' => ['nullable', 'date', 'before_or_equal:today'],
            'approval_date' => ['nullable', 'date', 'before_or_equal:today', 'after_or_equal:affiliation_date'],
            'contract_status' => ['nullable', Rule::in([
                Contractor::STATUS_PENDING,
                Contractor::STATUS_APPROVED,
                Contractor::STATUS_REJECTED,
                Contractor::STATUS_SUSPENDED
            ])],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'user_id' => 'usuario',
            'preferred_zip' => 'código postal',
            'address_line1' => 'dirección línea 1',
            'address_line2' => 'dirección línea 2',
            'city' => 'ciudad',
            'company_name' => 'nombre de la empresa',
            'license_number' => 'número de licencia',
            'is_insured' => 'está asegurado',
            'service_area' => 'área de servicio',
            'average_rating' => 'calificación promedio',
            'state_code' => 'código de estado',
            'country_code' => 'código de país',
            'lat' => 'latitud',
            'lng' => 'longitud',
            'mobile_number' => 'número de celular',
            'phone_number' => 'número de teléfono',
            'has_driving_license' => 'tiene licencia de conducir',
            'driving_license_category' => 'categoría de licencia de conducir',
            'linkedin_url' => 'URL de LinkedIn',
            'portfolio_url' => 'URL de portafolio',
            'affiliation_date' => 'fecha de afiliación',
            'approval_date' => 'fecha de aprobación',
            'contract_status' => 'estado del contrato',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'user_id.unique' => 'Este usuario ya tiene un contrato registrado.',
            'license_number.unique' => 'Este número de licencia ya está registrado.',
            'approval_date.after_or_equal' => 'La fecha de aprobación debe ser posterior o igual a la fecha de afiliación.',
            'lat.between' => 'La latitud debe estar entre -90 y 90 grados.',
            'lng.between' => 'La longitud debe estar entre -180 y 180 grados.',
            'average_rating.between' => 'La calificación debe estar entre 0 y 5.',
        ];
    }
}