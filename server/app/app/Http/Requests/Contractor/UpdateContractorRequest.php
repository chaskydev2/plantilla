<?php

namespace App\Http\Requests\Contractor;

use App\Models\Contractor;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContractorRequest extends FormRequest
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
        $contractorId = $this->route('contractor'); // Assuming the route parameter is 'contractor'
        
        return [
            'preferred_zip' => ['nullable', 'string', 'max:15'],
            'address_line1' => ['nullable', 'string', 'max:200'],
            'address_line2' => ['nullable', 'string', 'max:200'],
            'city' => ['nullable', 'string', 'max:120'],
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'license_number' => [
                'sometimes', 
                'required', 
                'string', 
                'max:255', 
                Rule::unique('contractors', 'license_number')->ignore($contractorId, 'user_id')
            ],
            'is_insured' => ['boolean'],
            'service_area' => ['sometimes', 'required', 'string', 'max:255'],
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
            'contract_status' => [
                'sometimes',
                'required', 
                Rule::in([
                    Contractor::STATUS_PENDING,
                    Contractor::STATUS_APPROVED,
                    Contractor::STATUS_REJECTED,
                    Contractor::STATUS_SUSPENDED
                ])
            ],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
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
            'license_number.unique' => 'This license number is already in use.',
            'approval_date.after_or_equal' => 'The approval date must be after or equal to the affiliation date.',
            'lat.between' => 'The latitude must be between -90 and 90 degrees.',
            'lng.between' => 'The longitude must be between -180 and 180 degrees.',
            'average_rating.between' => 'The rating must be between 0 and 5.',
        ];
    }
}