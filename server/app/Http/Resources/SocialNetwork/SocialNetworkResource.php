<?php

namespace App\Http\Resources\SocialNetwork;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SocialNetworkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url_facebook' => $this->url_facebook,
            'url_twitter' => $this->url_twitter,
            'url_instagram' => $this->url_instagram,
            'url_tiktok' => $this->url_tiktok,
            'url_linkedin' => $this->url_linkedin,
        ];
    }
}
