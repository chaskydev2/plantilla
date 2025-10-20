<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $guard_name = 'api';
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'email_verified_at',
        'password',
        'ci',
        'registration_code',
        'address',
        'mobile_number',
        'phone_number',
        'edit_profile',
        'verification',
        'created_id',
        'updated_id',
        'deleted_id',
        'restored_id',
        'created_at',
        'updated_at',
        'deleted_at',
        'restored_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'edit_profile' => 'boolean',
            'verification' => 'boolean',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
            'restored_at' => 'datetime',
        ];
    }

     protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->name)) {
                $firstName = $user->first_name ? ucfirst(strtolower($user->first_name)) : '';
                $lastName = $user->last_name ? ucfirst(strtolower($user->last_name)) : '';
                $user->name = trim("{$firstName} {$lastName}");
            }
        });

        static::updating(function ($user) {
            if ($user->isDirty(['first_name', 'last_name'])) {
                $firstName = $user->first_name ? ucfirst(strtolower($user->first_name)) : '';
                $lastName = $user->last_name ? ucfirst(strtolower($user->last_name)) : '';
                $user->name = trim("{$firstName} {$lastName}");
            }
        });
    }
    
    protected function firstName(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => ucfirst(strtolower($value)),
        );
    }

    protected function lastName(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => ucfirst(strtolower($value)),
        );
    }

    protected function ci(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? strtoupper(trim($value)) : null,
        );
    }

    protected function registrationCode(): Attribute
    {
        return Attribute::make(
            set: fn (?string $value) => $value ? strtoupper(trim($value)) : null,
        );
    }

    
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ?? trim($this->first_name . ' ' . $this->last_name),
            set: function (?string $value) {
                if ($value !== null) {
                    return $value;
                }
                
                $firstName = $this->first_name ? ucfirst(strtolower($this->first_name)) : '';
                $lastName = $this->last_name ? ucfirst(strtolower($this->last_name)) : '';
                
                return trim("{$firstName} {$lastName}");
            },
        );
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(first_name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(last_name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('UPPER(ci) LIKE ?', ['%' . strtoupper($search) . '%'])
                ->orWhereRaw('UPPER(registration_code) LIKE ?', ['%' . strtoupper($search) . '%']);
        });
    }

    public function scopeFilterByRole(Builder $query, ?string $role): Builder
    {
        if (!$role) {
            return $query;
        }

        return $query->whereHas('roles', function($q) use ($role) {
            $q->where('name', $role);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }

    public function scopeExcludeAdmin(Builder $query): Builder
    {
        return $query->where('email', '!=', 'admin@ctb.com.bo');
    }

    public function scopeWithRolesAndPermissions(Builder $query): Builder
    {
        return $query->with(['roles', 'permissions']);
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('verification', true);
    }

    public function scopeUnverified(Builder $query): Builder
    {
        return $query->where('verification', false);
    }

    public function scopeCanEditProfile(Builder $query): Builder
    {
        return $query->where('edit_profile', true);
    }

    public function scopeWithCI(Builder $query): Builder
    {
        return $query->whereNotNull('ci');
    }

    public function scopeWithRegistrationCode(Builder $query): Builder
    {
        return $query->whereNotNull('registration_code');
    }

    public function academicTrainings()
    {
        return $this->hasMany(AcademicTraining::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function technicalSkills()
    {
        return $this->hasMany(TechnicalSkill::class);
    }

     public function workReferences()
    {
        return $this->hasMany(WorkReference::class);
    }

    public function contractor()
    {
        return $this->hasOne(Contractor::class, 'user_id');
    }

    public function professions()
    {
        return $this->belongsToMany(Profession::class, 'contractor_professions', 'contractor_user_id', 'profession_id')
            ->withTimestamps();
    }

    public function homeownerProfile()
    {
        return $this->hasOne(HomeownerProfile::class, 'user_id');
    }

    // Audit relationships
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_id');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_id');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_id');
    }

    public function restoredBy()
    {
        return $this->belongsTo(User::class, 'restored_id');
    }
}
