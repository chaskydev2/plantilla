<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $table = 'job_posts';

    protected $fillable = [
        'homeowner_id',
        'service_id',
        'title',
        'descripti',
        'deadline',
        'status',
        'price',
        'currency',
        'address_line1',
        'address_line2',
        'city',
        'state_code',
        'postal_code',
        'lat',
        'lng',
        'image_path',
    ];

    protected $casts = [
        'deadline' => 'date',
        'price' => 'decimal:2',
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
    ];

    public function homeowner()
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_id', 'user_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function applications()
    {
        return $this->hasMany(JobApplication::class, 'job_post_id');
    }

    public function contracts()
    {
        return $this->hasMany(JobContract::class, 'job_post_id');
    }
}
