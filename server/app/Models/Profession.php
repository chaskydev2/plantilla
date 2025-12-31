<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Profession extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
        'image',
        'description',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessors & Mutators
    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function slug(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? Str::slug($value) : null,
        );
    }

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($profession) {
            if (empty($profession->slug) && !empty($profession->name)) {
                $profession->slug = Str::slug($profession->name);
            }
        });

        static::updating(function ($profession) {
            if ($profession->isDirty('name') && (empty($profession->slug) || $profession->slug === Str::slug($profession->getOriginal('name')))) {
                $profession->slug = Str::slug($profession->name);
            }
        });
    }

    // Relationships
    public function contractors()
    {
        return $this->belongsToMany(User::class, 'contractor_professions', 'profession_id', 'contractor_user_id')
            ->withTimestamps();
    }

    // Scopes
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(description) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(slug) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeBySlug(Builder $query, string $slug): Builder
    {
        return $query->where('slug', $slug);
    }

    public function scopeSort(Builder $query, string $sortBy = 'name', string $sortDir = 'asc'): Builder
    {
        $allowedSorts = ['name', 'slug', 'created_at', 'updated_at'];

        if (in_array($sortBy, $allowedSorts)) {
            return $query->orderBy($sortBy, $sortDir);
        }

        return $query->orderBy('name', 'asc');
    }

    public function scopeWithContractorsCount(Builder $query): Builder
    {
        return $query->withCount('contractors');
    }

    // Helper methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getContractorsCountAttribute(): int
    {
        return $this->contractors()->count();
    }

    public function hasContractors(): bool
    {
        return $this->contractors()->exists();
    }
}