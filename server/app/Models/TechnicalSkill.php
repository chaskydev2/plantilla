<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class TechnicalSkill extends Model
{
    protected $guard_name = 'api';

    protected $fillable = [
        'user_id',
        'skill_type',
        'skill_name',
        'skill_level',
        'description',
    ];

    public const SKILL_TYPES = ['software', 'equipment', 'technical'];
    public const SKILL_LEVELS = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];

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
            $q->whereRaw('LOWER(skill_name) LIKE ?', ['%' . strtolower($search) . '%']);
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

    public function scopeFilterByType(Builder $query, string $type): Builder
    {
        if (!$type) {
            return $query;
        }

        return $query->where('skill_type', $type);
    }
}
