<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class HomeownerProfile extends Model
{
    use HasFactory;
    protected $guard_name = 'api';
    
    protected $primaryKey = 'user_id';
    public $incrementing = false;
    protected $keyType = 'int';

    protected $fillable = [
        'user_id',
        'preferred_zip',
        'address_line1',
        'address_line2',
        'city',
        'state_code',
        'country_code',
        'lat',
        'lng',
    ];

    protected $casts = [
        'lat' => 'decimal:6',
        'lng' => 'decimal:6',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getRouteKeyName(): string
    {
        return 'user_id';
    }
    
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(city) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(state_code) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhere('preferred_zip', 'LIKE', '%' . $search . '%');
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'user_id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }

    public function scopeFilterByCountry(Builder $query, ?string $country_code): Builder
    {
        if (!$country_code) {
            return $query;
        }

        return $query->where('country_code', $country_code);
    }

    public function scopeFilterByState(Builder $query, ?string $state_code): Builder
    {
        if (!$state_code) {
            return $query;
        }

        return $query->where('state_code', $state_code);
    }

    public function messageThreads(): HasMany
    {
        return $this->hasMany(ContractorMessageThread::class, 'participant_user_id', 'user_id')
            ->where('participant_type', 'homeowner')
            ->orderByDesc('last_message_at');
    }

    public function contractorMessages(): HasManyThrough
    {
        return $this->hasManyThrough(
            ContractorMessage::class,
            ContractorMessageThread::class,
            'participant_user_id',
            'thread_id',
            'user_id',
            'id'
        )->where('contractor_message_threads.participant_type', 'homeowner')
         ->orderBy('message_number');
    }

    public function contractors(): BelongsToMany
    {
        return $this->belongsToMany(
            Contractor::class,
            'contractor_message_threads',
            'participant_user_id',
            'contractor_user_id',
            'user_id',
            'user_id'
        )->wherePivot('participant_type', 'homeowner')
         ->withPivot('id as thread_id', 'status', 'last_message_at')
         ->orderBy('contractor_message_threads.last_message_at', 'desc');
    }

    public function services()
    {
        return $this->belongsToMany(
            Service::class,
            'homeowner_profile_service',
            'homeowner_profile_id',
            'service_id',
            'user_id',
            'id'
        )->using(HomeownerProfileService::class)
         ->withTimestamps();
    }
}