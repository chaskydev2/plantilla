<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScamAlert extends Model
{
    use HasFactory;

    protected $fillable = [
        'contractor_id',
        'homeowner_profile_id',
        'business_name',
        'legal_name',
        'business_owner',
        'operating_states',
        'complaint_location',
        'amount_in_dispute',
        'complaints_count',
        'reason_for_listing',
        'business_response',
        'reported_at',
        'status',
    ];

    protected $casts = [
        'operating_states' => 'array',
        'amount_in_dispute' => 'decimal:2',
        'reported_at' => 'date',
    ];

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class, 'contractor_id', 'user_id');
    }

    public function homeownerProfile(): BelongsTo
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_profile_id', 'user_id');
    }
}
