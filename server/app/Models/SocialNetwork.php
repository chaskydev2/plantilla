<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class SocialNetwork extends Model
{
    protected $fillable = [
        'url_facebook',
        'url_twitter',
        'url_instagram',
        'url_tiktok',
        'url_linkedin',
    ];

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->whereRaw('LOWER(url_facebook) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(url_twitter) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(url_instagram) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(url_tiktok) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(url_linkedin) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }
}
