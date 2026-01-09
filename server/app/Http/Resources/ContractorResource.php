<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\UserResource;

class ContractorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'company_info' => [
                'company_name' => $this->company_name,
                'license_number' => $this->license_number,
                'is_insured' => $this->is_insured,
                'service_area' => $this->service_area,
                'average_rating' => $this->average_rating,
            ],
            'address' => [
                'preferred_zip' => $this->preferred_zip,
                'address_line1' => $this->address_line1,
                'address_line2' => $this->address_line2,
                'city' => $this->city,
                'state_code' => $this->state_code,
                'country_code' => $this->country_code,
                'full_address' => $this->full_address,
            ],
            'location' => [
                'lat' => $this->lat,
                'lng' => $this->lng,
            ],
            'contact' => [
                'mobile_number' => $this->mobile_number,
                'phone_number' => $this->phone_number,
                'linkedin_url' => $this->linkedin_url,
                'portfolio_url' => $this->portfolio_url,
            ],
            'professional' => [
                'has_driving_license' => $this->has_driving_license,
                'driving_license_category' => $this->driving_license_category,
            ],
            'contract' => [
                'affiliation_date' => $this->affiliation_date?->format('Y-m-d'),
                'approval_date' => $this->approval_date?->format('Y-m-d'),
                'contract_status' => $this->contract_status,
                'status_label' => $this->status_label,
                'is_approved' => $this->isApproved(),
                'is_pending' => $this->isPending(),
                'is_rejected' => $this->isRejected(),
                'is_suspended' => $this->isSuspended(),
            ],
            'timestamps' => [
                'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            ],
        ];
    }
}