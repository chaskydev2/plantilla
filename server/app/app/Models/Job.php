<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Job extends Model
{
    protected $table = 'jobs';

    public $timestamps = false;

    protected $fillable = [
        'queue',
        'payload',
        'attempts',
        'reserved_at',
        'available_at',
        'created_at',
    ];

    protected $casts = [
        'attempts'     => 'integer',
        'reserved_at'  => 'integer',
        'available_at' => 'integer',
        'created_at'   => 'integer',
    ];

    /* =======================
     | Scopes útiles
     ======================= */

    public function scopeByQueue(Builder $query, string $queue): Builder
    {
        return $query->where('queue', $queue);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->whereNull('reserved_at');
    }

    public function scopeReserved(Builder $query): Builder
    {
        return $query->whereNotNull('reserved_at');
    }

    public function scopeFailedAttempts(Builder $query, int $attempts = 3): Builder
    {
        return $query->where('attempts', '>=', $attempts);
    }

    /* =======================
     | Helpers
     ======================= */

    public function isReserved(): bool
    {
        return !is_null($this->reserved_at);
    }

    public function payloadArray(): array
    {
        return json_decode($this->payload, true) ?? [];
    }
}
