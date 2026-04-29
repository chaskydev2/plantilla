<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobContract extends Model
{
    protected $table = 'job_contracts';
    protected $fillable = [
        'job_post_id', 'contractor_id', 'start_date', 'end_date', 'status'
    ];
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }
    public function contractor()
    {
        return $this->belongsTo(User::class, 'contractor_id');
    }
}
