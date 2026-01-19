<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HomeownerProfileService extends Pivot
{
    protected $table = 'homeowner_profile_service';
    public $incrementing = false;
    protected $fillable = [
        'homeowner_profile_id',
        'service_id',
    ];

    public function homeownerProfile(): BelongsTo
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_profile_id', 'user_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
