<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Contractor extends Model
{
    protected $table = 'contractors';
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = [
        'user_id',
        'preferred_zip',
        'address_line1',
        'address_line2',
        'city',
        'company_name',
        'license_number',
        'is_insured',
        'service_area',
        'average_rating', // Importante: Este campo almacenará el promedio
        'state_code',
        'country_code',
        'lat',
        'lng',
        'mobile_number',
        'phone_number',
        'has_driving_license',
        'driving_license_category',
        'linkedin_url',
        'portfolio_url',
        'affiliation_date',
        'approval_date',
        'contract_status',
    ];

    protected $casts = [
        'is_insured' => 'boolean',
        'has_driving_license' => 'boolean',
        'average_rating' => 'decimal:2',
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
        'affiliation_date' => 'date',
        'approval_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Status constants
    const STATUS_PENDING = 'pendiente';
    const STATUS_APPROVED = 'aprobado';
    const STATUS_REJECTED = 'rechazado';
    const STATUS_SUSPENDED = 'suspendido';

    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pendiente',
            self::STATUS_APPROVED => 'Aprobado',
            self::STATUS_REJECTED => 'Rechazado',
            self::STATUS_SUSPENDED => 'Suspendido',
        ];
    }

    // Accessors & Mutators
    protected function companyName(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function licenseNumber(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? strtoupper(trim($value)) : null,
        );
    }

    protected function serviceArea(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function city(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? ucwords(strtolower(trim($value))) : null,
        );
    }

    protected function fullAddress(): Attribute
    {
        return Attribute::make(
            get: function () {
                $address = [];
                
                if ($this->address_line1) {
                    $address[] = $this->address_line1;
                }
                
                if ($this->address_line2) {
                    $address[] = $this->address_line2;
                }
                
                if ($this->city) {
                    $address[] = $this->city;
                }
                
                if ($this->state_code) {
                    $address[] = $this->state_code;
                }
                
                if ($this->preferred_zip) {
                    $address[] = $this->preferred_zip;
                }
                
                return implode(', ', $address);
            }
        );
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'contractor_categories', 'contractor_user_id', 'category_id', 'user_id');
    }

    public function professions()
    {
        return $this->belongsToMany(Profession::class, 'contractor_professions', 'contractor_user_id', 'profession_id', 'user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'contractor_tag', 'contractor_user_id', 'tag_id', 'user_id');
    }

    public function messageThreads(): HasMany
    {
        return $this->hasMany(ContractorMessageThread::class, 'contractor_user_id', 'user_id')
            ->orderByDesc('last_message_at');
    }

    // Team relationships (self-referential)
    public function teamMembers()
    {
        return $this->belongsToMany(
            Contractor::class,
            'contractor_team_members',
            'leader_user_id',
            'member_user_id',
            'user_id',
            'user_id'
        )->withPivot('status', 'compania');
    }

    public function teamLeaders()
    {
        return $this->belongsToMany(
            Contractor::class,
            'contractor_team_members',
            'member_user_id',
            'leader_user_id',
            'user_id',
            'user_id'
        )->withPivot('status', 'compania');
    }

    public function jobsCreator()
    {
        return $this->hasMany(JobContractor::class, 'id_creator', 'user_id');
    }

    // Scopes
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('contract_status', self::STATUS_APPROVED);
    }

    public function scopePending(Builder $query): Builder
    {
        return $query->where('contract_status', self::STATUS_PENDING);
    }

    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('contract_status', self::STATUS_REJECTED);
    }

    public function scopeSuspended(Builder $query): Builder
    {
        return $query->where('contract_status', self::STATUS_SUSPENDED);
    }

    public function scopeInsured(Builder $query): Builder
    {
        return $query->where('is_insured', true);
    }

    public function scopeWithDrivingLicense(Builder $query): Builder
    {
        return $query->where('has_driving_license', true);
    }

    public function scopeByCity(Builder $query, ?string $city): Builder
    {
        if (!$city) {
            return $query;
        }

        return $query->whereRaw('LOWER(city) LIKE ?', ['%' . strtolower($city) . '%']);
    }

    public function scopeByServiceArea(Builder $query, ?string $area): Builder
    {
        if (!$area) {
            return $query;
        }

        return $query->whereRaw('LOWER(service_area) LIKE ?', ['%' . strtolower($area) . '%']);
    }

    public function scopeByRating(Builder $query, float $minRating = 0.0): Builder
    {
        return $query->where('average_rating', '>=', $minRating);
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(company_name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('UPPER(license_number) LIKE ?', ['%' . strtoupper($search) . '%'])
                ->orWhereRaw('LOWER(service_area) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(city) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereHas('user', function($userQuery) use ($search) {
                    $userQuery->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
                });
        });
    }

    public function scopeWithinRadius(Builder $query, float $lat, float $lng, float $radius = 50): Builder
    {
        return $query->whereNotNull('lat')
            ->whereNotNull('lng')
            ->selectRaw("
                *, 
                (6371 * acos(cos(radians(?)) * cos(radians(lat)) * cos(radians(lng) - radians(?)) + sin(radians(?)) * sin(radians(lat)))) AS distance
            ", [$lat, $lng, $lat])
            ->having('distance', '<=', $radius)
            ->orderBy('distance');
    }

    public function scopeSort(Builder $query, string $sortBy = 'created_at', string $sortDir = 'desc'): Builder
    {
        $allowedSorts = [
            'created_at', 'updated_at', 'company_name', 'average_rating', 
            'affiliation_date', 'approval_date', 'contract_status', 'city'
        ];

        if (in_array($sortBy, $allowedSorts)) {
            return $query->orderBy($sortBy, $sortDir);
        }

        return $query->orderBy('created_at', 'desc');
    }

    // Helper methods
    public function isApproved(): bool
    {
        return $this->contract_status === self::STATUS_APPROVED;
    }

    public function isPending(): bool
    {
        return $this->contract_status === self::STATUS_PENDING;
    }

    public function isRejected(): bool
    {
        return $this->contract_status === self::STATUS_REJECTED;
    }

    public function isSuspended(): bool
    {
        return $this->contract_status === self::STATUS_SUSPENDED;
    }

    public function approve(): bool
    {
        $this->contract_status = self::STATUS_APPROVED;
        $this->approval_date = now()->toDateString();
        return $this->save();
    }

    public function reject(): bool
    {
        $this->contract_status = self::STATUS_REJECTED;
        return $this->save();
    }

    public function suspend(): bool
    {
        $this->contract_status = self::STATUS_SUSPENDED;
        return $this->save();
    }

    public function getStatusLabelAttribute(): string
    {
        return self::getStatuses()[$this->contract_status] ?? 'Desconocido';
    }

    public function attributeContractors()
    {
        return $this->hasMany(AttributeContractor::class, 'contractor_id', 'id');
    }

    public function messages()
    {
        return $this->hasMany(ContractorMessageThread::class, 'contractor_user_id', 'user_id');
    }

    public function reviews()
    {
    
        return $this->hasMany(Review::class, 'contractor_id', 'user_id');
    }

    public function updateAverageRating()
    {
        
        $avg = $this->reviews()->avg('rating');
        
      
        $this->average_rating = round($avg, 2);
        $this->save();
    }
}