<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

class ContractorMessage extends Model
{
    protected $table = 'contractor_messages';

    protected $fillable = [
        'contractor_user_id',
        'thread_id',
        'sender_type',
        'sender_user_id',
        'guest_name',
        'guest_email',
        'message',
        'attachments',
        'links',
        'status',
        'sent_at',
        'read_at',
        'message_number',
    ];

    protected $casts = [
        'attachments' => 'array',
        'links' => 'array',
        'sent_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $message): void {
            if ($message->thread_id && !$message->message_number) {
                $nextNumber = static::where('thread_id', $message->thread_id)->max('message_number');
                $message->message_number = $nextNumber ? $nextNumber + 1 : 1;
            }

            if (!$message->sent_at) {
                $message->sent_at = Carbon::now();
            }
        });

        static::created(function (self $message): void {
            if ($message->thread_id) {
                $message->thread()->update([
                    'last_message_at' => $message->sent_at,
                ]);
            }
        });
    }

    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class, 'contractor_user_id', 'user_id');
    }

    public function senderUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_user_id');
    }

    public function thread(): BelongsTo
    {
        return $this->belongsTo(ContractorMessageThread::class, 'thread_id');
    }
}
