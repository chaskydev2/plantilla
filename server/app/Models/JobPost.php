<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobPost extends Model
{
    protected $table = 'job_posts';
    protected $fillable = [
        'homeowner_id', 'title', 'description', 'deadline', 'status'
    ];
    public function homeowner()
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_id', 'user_id');
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
