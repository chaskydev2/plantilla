<?php

namespace App\Http\Resources\Announcement;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnnouncementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'start_date' => $this->start_date,
            'image' => $this->image,
            'type' => $this->type,
            'published_by' => $this->published_by,
            'visible_until' => $this->visible_until,
        ];
    }
}
