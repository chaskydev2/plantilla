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
            'preferred_zip' => 'postal code',
            'address_line1' => 'address line 1',
            'address_line2' => 'address line 2',
            'city' => 'city',
            'company_name' => 'company name',
            'license_number' => 'license number',
            'is_insured' => 'is insured',
            'service_area' => 'service area',
            'average_rating' => 'average rating',
            'state_code' => 'state code',
            'country_code' => 'country code',
            'lat' => 'latitude',
            'lng' => 'longitude',
            'mobile_number' => 'mobile number',
            'phone_number' => 'phone number',
            'has_driving_license' => 'has driving license',
            'driving_license_category' => 'driving license category',
            'linkedin_url' => 'LinkedIn URL',
            'portfolio_url' => 'portfolio URL',
            'affiliation_date' => 'affiliation date',
            'approval_date' => 'approval date',
            'contract_status' => 'contract status',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'license_number.unique' => 'This license number is already registered.',
            'approval_date.after_or_equal' => 'The approval date must be after or equal to the affiliation date.',
            'lat.between' => 'Latitude must be between -90 and 90 degrees.',
            'lng.between' => 'Longitude must be between -180 and 180 degrees.',
            'average_rating.between' => 'The rating must be between 0 and 5.',
        ];
    }
}