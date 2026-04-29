<?php

namespace App\Http\Requests\HomeownerProfileService;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreHomeownerProfileServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $homeownerProfileId = $this->route('homeowner_profile')?->user_id
            ?? $this->route('homeowner')?->user_id
            ?? $this->route('homeownerProfile')?->user_id;

        return [
            'service_id' => [
                'required',
                'integer',
                'exists:services,id',
                Rule::unique('homeowner_profile_service', 'service_id')
                    ->where(fn ($q) => $q->where('homeowner_profile_id', $homeownerProfileId)),
            ],
        ];
    }
}
