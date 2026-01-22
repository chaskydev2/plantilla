<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ContractorMessageThread extends Model
{
    protected $table = 'contractor_message_threads';

    protected $fillable = [
        'contractor_user_id',
        'participant_type',
        'participant_user_id',
        'guest_name',
        'guest_email',
        'status',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class, 'contractor_user_id', 'user_id');
    }

    public function participant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'participant_user_id');
    }

    public function homeowner(): BelongsTo
    {
        return $this->belongsTo(HomeownerProfile::class, 'participant_user_id', 'user_id')
            ->where('participant_type', 'homeowner');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ContractorMessage::class, 'thread_id')
            ->orderBy('message_number');
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(ContractorMessage::class, 'thread_id')
            ->latest('sent_at');
    }
}
