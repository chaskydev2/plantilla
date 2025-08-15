<?php

namespace App\Http\Resources\Course;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'instructor_id' => $this->instructor_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'modality' => $this->modality,
            'location' => $this->location,
            'cost' => $this->cost,
            'max_capacity' => $this->max_capacity,
            'status' => $this->status,
            'has_certificate' => $this->has_certificate,
            'attendance_tracking' => $this->attendance_tracking,
        ];
    }
}
