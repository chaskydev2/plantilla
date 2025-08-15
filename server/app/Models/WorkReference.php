<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class WorkReference extends Model
{
    protected $guard_name = 'api';

    protected $fillable = [
        'user_id',
        'reference_name',
        'company',
        'position',
        'phone',
        'email',
        'additional_notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(reference_name) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }

    public function scopeFilterByUser(Builder $query, string $user_id): Builder
    {
        if (!$user_id) {
            return $query;
        }

        return $query->where('user_id', $user_id);
    }
}
