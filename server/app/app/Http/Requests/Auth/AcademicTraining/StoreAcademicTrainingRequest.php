<?php

namespace App\Http\Requests\Auth\AcademicTraining;

use Illuminate\Foundation\Http\FormRequest;

class StoreAcademicTrainingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'professional_title' => 'required',
            'academic_degree' => 'required',
            'graduated_from' => 'required',
            'relevant_certifications' => 'nullable|string',
            'graduation_date' => 'required',
            'degree_date' => 'required',
        ];
    }
}
