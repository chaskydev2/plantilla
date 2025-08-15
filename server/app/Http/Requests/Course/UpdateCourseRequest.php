<?php

namespace App\Http\Requests\Course;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required',
            'instructor_id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'modality' => 'nullable',
            'location' => 'required',
            'cost' => 'required',
            'max_capacity' => 'required',
            'status' => 'required',
            'has_certificate' => 'required',
            'attendance_tracking' => 'required',
        ];
    }
}
