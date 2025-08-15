<?php

namespace App\Http\Requests\Announcement;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required',
            'content' => 'required',
            'start_date' => 'required',
            'image' => 'nullable',
            'type' => 'required',
            'published_by' => 'required',
            'visible_until' => 'nullable',
        ];
    }
}
