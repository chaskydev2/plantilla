<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Course extends Model
{
    protected $fillable = [
        'name',
        'instructor_id',
        'start_date',
        'end_date',
        'modality',
        'location',
        'cost',
        'max_capacity',
        'status',
        'has_certificate',
        'attendance_tracking',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'has_certificate' => 'boolean',
        'attendance_tracking' => 'boolean',
        'cost' => 'decimal:2'
    ];

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }
}