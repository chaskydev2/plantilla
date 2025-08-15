<?php

namespace App\Http\Requests\SocialNetwork;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSocialNetworkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'url_facebook'  => 'nullable|url|',
            'url_twitter'   => 'nullable|url|',
            'url_instagram' => 'nullable|url|',
            'url_tiktok'    => 'nullable|url|',
            'url_linkedin'  => 'nullable|url|',
        ];
    }
}
