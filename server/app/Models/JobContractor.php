<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class JobContractor extends Model
{
    protected $table = 'job_contractor';

    protected $fillable = [
        'id_creator',
        'id_homeowner',
        'title',
        'description',
        'location',
        'service_type',
        'image_url',
        'url',
        'amount_paid',
        'is_active',
        'comment',
        'job_date',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'is_active' => 'boolean',
        'job_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function creator()
    {
        return $this->belongsTo(User::class, 'id_creator');
    }

    public function homeowner()
    {
        return $this->belongsTo(HomeownerProfile::class, 'id_homeowner', 'user_id');
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%'])
              ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%'])
              ->orWhereRaw('LOWER(location) LIKE ?', ['%' . strtolower($search) . '%'])
              ->orWhereRaw('LOWER(service_type) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'created_at', string $sortDir = 'desc'): Builder
    {
        $allowedSorts = [
            'created_at', 'updated_at', 'title', 'location', 'service_type',
            'is_active', 'amount_paid', 'job_date'
        ];

        if (in_array($sortBy, $allowedSorts)) {
            return $query->orderBy($sortBy, $sortDir);
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function scopeByCreator(Builder $query, int $creatorId): Builder
    {
        return $query->where('id_creator', $creatorId);
    }

    public function scopeByHomeowner(Builder $query, int $homeownerId): Builder
    {
        return $query->where('id_homeowner', $homeownerId);
    }

    public function scopeDateRange(Builder $query, ?string $startDate, ?string $endDate): Builder
    {
        if ($startDate) {
            $query->whereDate('job_date', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('job_date', '<=', $endDate);
        }

        return $query;
    }

    // Helpers
    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    public function isInactive(): bool
    {
        return !$this->is_active;
    }
}
