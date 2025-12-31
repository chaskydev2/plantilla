<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
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

    // Relationships
    public function contractors()
    {
        return $this->belongsToMany(Contractor::class, 'contractor_tag', 'tag_id', 'contractor_user_id', 'id', 'user_id');
    }

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            if (empty($tag->slug) && !empty($tag->name)) {
                $tag->slug = Str::slug($tag->name);
            }
        });

        static::updating(function ($tag) {
            if ($tag->isDirty('name') && (empty($tag->slug) || $tag->slug === Str::slug($tag->getOriginal('name')))) {
                $tag->slug = Str::slug($tag->name);
            }
        });
    }

    // Scopes
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
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

    // Helper methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
