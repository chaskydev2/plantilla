<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContratoResource extends JsonResource
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
                'service_area' => $this->service_area,
                'is_insured' => $this->is_insured,
                'average_rating' => $this->average_rating,
                'rating_stars' => $this->rating_stars,
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
            'coordinates' => [
                'lat' => $this->lat,
                'lng' => $this->lng,
                'has_coordinates' => $this->hasValidCoordinates(),
            ],
            'contact' => [
                'mobile_number' => $this->mobile_number,
                'phone_number' => $this->phone_number,
                'linkedin_url' => $this->linkedin_url,
                'portfolio_url' => $this->portfolio_url,
            ],
            'driving_info' => [
                'has_driving_license' => $this->has_driving_license,
                'driving_license_category' => $this->driving_license_category,
            ],
            'contract_info' => [
                'affiliation_date' => $this->affiliation_date,
                'approval_date' => $this->approval_date,
                'contract_status' => $this->contract_status,
                'status_label' => $this->status_label,
                'status_color' => $this->status_color,
                'is_approved' => $this->isApproved(),
                'is_pending' => $this->isPending(),
                'is_rejected' => $this->isRejected(),
                'is_suspended' => $this->isSuspended(),
            ],
            'timestamps' => [
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
        ];
    }
}