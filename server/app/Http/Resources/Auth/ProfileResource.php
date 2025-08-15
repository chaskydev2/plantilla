<?php

namespace App\Http\Resources\Auth;

use App\Http\Resources\Auth\AcademicTraining\AcademicTrainingResource;
use App\Http\Resources\Auth\TechnicalSkill\TechnicalSkillResource;
use App\Http\Resources\Auth\WorkExperience\WorkExperienceResource;
use App\Http\Resources\Auth\WorkReference\WorkReferenceResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->fullName,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'ci' => $this->ci,
            'registration_code' => $this->registration_code,
            'address' => $this->address,
            'mobile_number' => $this->mobile_number,
            'phone_number' => $this->phone_number,
            'college_affiliation_date' => $this->college_affiliation_date,
            'linkedin_url' => $this->linkedin_url,
            'portfolio_url' => $this->portfolio_url,
            'professional_summary' => $this->professional_summary,
            'travel_availability' => $this->travel_availability,
            'has_driving_license' => $this->has_driving_license,
            'driving_license_category' => $this->driving_license_category,
            'edit_profile' => $this->edit_profile,
            'role_name' => $this->roles()->first()?->name,
            'academics' => AcademicTrainingResource::collection($this->whenLoaded('academicTrainings')),
            'skills' => TechnicalSkillResource::collection($this->whenLoaded('technicalSkills')),
            'experiences' => WorkExperienceResource::collection($this->whenLoaded('workExperiences')),
            'references' => WorkReferenceResource::collection($this->whenLoaded('workReferences')),
        ];
    }
}
