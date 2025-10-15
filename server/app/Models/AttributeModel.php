<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute as CastAttribute;
use Illuminate\Support\Str;

class AttributeModel extends Model
{
    use HasFactory;

    protected $table = 'attributes';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'required_for',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Constants for required_for field
    const REQUIRED_FOR_HOMEOWNER = 'homeowner';
    const REQUIRED_FOR_CONTRACTOR = 'contractor';
    const REQUIRED_FOR_BOTH = 'both';

    public static function getRequiredForOptions(): array
    {
        return [
            self::REQUIRED_FOR_HOMEOWNER => 'Propietario',
            self::REQUIRED_FOR_CONTRACTOR => 'Contratista',
            self::REQUIRED_FOR_BOTH => 'Ambos',
        ];
    }

    // Accessors & Mutators
    protected function name(): CastAttribute
    {
        return CastAttribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function slug(): CastAttribute
    {
        return CastAttribute::make(
            set: fn (?string $value) => $value ? Str::slug($value) : null,
        );
    }

    // Boot method to auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($attribute) {
            if (empty($attribute->slug) && !empty($attribute->name)) {
                $attribute->slug = Str::slug($attribute->name);
            }
        });

        static::updating(function ($attribute) {
            if ($attribute->isDirty('name') && (empty($attribute->slug) || $attribute->slug === Str::slug($attribute->getOriginal('name')))) {
                $attribute->slug = Str::slug($attribute->name);
            }
        });
    }

    // Relationships
    public function contractors()
    {
        return $this->belongsToMany(Contractor::class, 'contractor_attributes')
            ->withPivot('value')
            ->withTimestamps();
    }

    public function homeownerProfiles()
    {
        return $this->belongsToMany(HomeownerProfile::class, 'homeowner_attributes')
            ->withPivot('value')
            ->withTimestamps();
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_attributes')
            ->withPivot('value')
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

    public function scopeByRequiredFor(Builder $query, string $requiredFor): Builder
    {
        return $query->where('required_for', $requiredFor);
    }

    public function scopeForHomeowner(Builder $query): Builder
    {
        return $query->whereIn('required_for', [self::REQUIRED_FOR_HOMEOWNER, self::REQUIRED_FOR_BOTH]);
    }

    public function scopeForContractor(Builder $query): Builder
    {
        return $query->whereIn('required_for', [self::REQUIRED_FOR_CONTRACTOR, self::REQUIRED_FOR_BOTH]);
    }

    public function scopeForBoth(Builder $query): Builder
    {
        return $query->where('required_for', self::REQUIRED_FOR_BOTH);
    }

    public function scopeSort(Builder $query, string $sortBy = 'name', string $sortDir = 'asc'): Builder
    {
        $allowedSorts = ['name', 'slug', 'required_for', 'created_at', 'updated_at'];

        if (in_array($sortBy, $allowedSorts)) {
            return $query->orderBy($sortBy, $sortDir);
        }

        return $query->orderBy('name', 'asc');
    }

    public function scopeWithContractorsCount(Builder $query): Builder
    {
        return $query->withCount('contractors');
    }

    public function scopeWithHomeownersCount(Builder $query): Builder
    {
        return $query->withCount('homeownerProfiles');
    }

    public function scopeWithUsersCount(Builder $query): Builder
    {
        return $query->withCount('users');
    }

    // Helper methods
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function getRequiredForLabelAttribute(): string
    {
        return self::getRequiredForOptions()[$this->required_for] ?? 'Desconocido';
    }

    public function isForHomeowner(): bool
    {
        return in_array($this->required_for, [self::REQUIRED_FOR_HOMEOWNER, self::REQUIRED_FOR_BOTH]);
    }

    public function isForContractor(): bool
    {
        return in_array($this->required_for, [self::REQUIRED_FOR_CONTRACTOR, self::REQUIRED_FOR_BOTH]);
    }

    public function isForBoth(): bool
    {
        return $this->required_for === self::REQUIRED_FOR_BOTH;
    }

    public function getContractorsCountAttribute(): int
    {
        return $this->contractors()->count();
    }

    public function getHomeownersCountAttribute(): int
    {
        return $this->homeownerProfiles()->count();
    }

    public function getUsersCountAttribute(): int
    {
        return $this->users()->count();
    }

    public function hasContractors(): bool
    {
        return $this->contractors()->exists();
    }

    public function hasHomeowners(): bool
    {
        return $this->homeownerProfiles()->exists();
    }

    public function hasUsers(): bool
    {
        return $this->users()->exists();
    }
}