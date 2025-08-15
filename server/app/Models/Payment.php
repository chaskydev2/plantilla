<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'payment_type',
        'payment_month',
        'payment_method',
        'payment_year',
        'observation',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function ($q) use ($search) {
            $q->whereHas('user', function ($userQ) use ($search) {
                $userQ->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                    ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
            })
                ->orWhereRaw('LOWER(observation) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }
}
