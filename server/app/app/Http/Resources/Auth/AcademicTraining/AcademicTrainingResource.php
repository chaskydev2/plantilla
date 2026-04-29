<?php

namespace App\Http\Resources\Auth\AcademicTraining;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AcademicTrainingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'professional_title' => $this->professional_title,
            'academic_degree' => $this->academic_degree,
            'graduated_from' => $this->graduated_from,
            'relevant_certifications' => $this->relevant_certifications,
            'graduation_date' => $this->graduation_date,
            'degree_date' => $this->degree_date,
        ];
    }
}
