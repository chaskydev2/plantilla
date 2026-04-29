<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatThread extends Model
{
    use HasFactory;

    protected $fillable = [
        'contractor_id',
        'homeowner_profile_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class);
    }

    public function homeownerProfile(): BelongsTo
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_profile_id', 'user_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }

    public function latestMessage(): HasMany
    {
        return $this->hasMany(ChatMessage::class)->latest();
    }
}
