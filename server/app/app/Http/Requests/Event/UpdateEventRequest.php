<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
         return [
            'name' => 'required',
            'event_type_id' => 'required',
            'start_date' => 'required',
            'end_date' => 'nullable',
            'location' => 'required',
            'generates_fine' => 'nullable',
        ];
    }
}
