<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Beginning extends Model
{
    protected $fillable = [
        'mission',
        'vision',
        'our_father',
    ];

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->whereRaw('LOWER(mission) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(vision) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }
}
