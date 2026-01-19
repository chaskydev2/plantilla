<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'image',
        'description',
    ];

    public function professions()
    {
        return $this->hasMany(Profession::class);
    }

    public function homeownerProfiles()
    {
        return $this->belongsToMany(
            HomeownerProfile::class,
            'homeowner_profile_service',
            'service_id',
            'homeowner_profile_id',
            'id',
            'user_id'
        )->using(HomeownerProfileService::class)
         ->withTimestamps();
    }
}
