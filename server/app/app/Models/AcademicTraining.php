<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class AcademicTraining extends Model
{
    protected $guard_name = 'api';

    protected $fillable = [
        'user_id',
        'professional_title',
        'academic_degree',
        'graduated_from',
        'relevant_certifications',
        'graduation_date',
        'degree_date',
    ];

    protected $casts = [
        'graduation_date' => 'date',
        'degree_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Mutators para manejar fechas ISO 8601
    protected function graduationDate(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Carbon::parse($value)->format('Y-m-d') : null,
        );
    }

    protected function degreeDate(): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Carbon::parse($value)->format('Y-m-d') : null,
        );
    }

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
            $q->whereRaw('LOWER(professional_title) LIKE ?', ['%' . strtolower($search) . '%']);
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
