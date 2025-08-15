<?php

namespace App\Http\Resources\Event;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'event_type_id' => $this->event_type_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'location' => $this->location,
            'generates_fine' => $this->generates_fine,
        ];
    }
}
