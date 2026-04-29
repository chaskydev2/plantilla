<?php

namespace App\Http\Requests\ScamAlert;

use Illuminate\Foundation\Http\FormRequest;

class StoreScamAlertRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'homeowner_profile_id' => ['required', 'integer', 'exists:homeowner_profiles,user_id'],
            'contractor_id' => ['nullable', 'integer', 'exists:contractors,user_id'],
            'business_name' => ['required', 'string', 'max:255'],
            'legal_name' => ['nullable', 'string', 'max:255'],
            'business_owner' => ['nullable', 'string', 'max:255'],
            'operating_states' => ['nullable', 'array'],
            'operating_states.*' => ['string', 'max:10'],
            'complaint_location' => ['nullable', 'string', 'max:255'],
            'amount_in_dispute' => ['nullable', 'numeric', 'min:0'],
            'complaints_count' => ['nullable', 'integer', 'min:1'],
            'reason_for_listing' => ['required', 'string'],
            'business_response' => ['nullable', 'string'],
            'reported_at' => ['required', 'date'],
            'status' => ['nullable', 'in:active,resolved,closed'],
        ];
    }
}
