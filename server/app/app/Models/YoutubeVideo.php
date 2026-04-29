<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class YoutubeVideo extends Model
{
    protected $fillable = [
        'title',
        'youtube_url',
        'description',
        'category',
        'topic',
        'views',
    ];
}
