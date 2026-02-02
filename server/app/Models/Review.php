<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'homeowner_profile_id',
        'contractor_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relación con HomeownerProfile (quien da la calificación)
     */
    public function homeownerProfile(): BelongsTo
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_profile_id', 'user_id');
    }

    /**
     * Relación con Contractor (quien recibe la calificación)
     */
    public function contractor(): BelongsTo
    {
        return $this->belongsTo(Contractor::class, 'contractor_id', 'user_id');
    }

    /**
     * Scope para filtrar por calificación mínima
     */
    public function scopeMinimumRating($query, int $rating)
    {
        return $query->where('rating', '>=', $rating);
    }

    /**
     * Scope para obtener reseñas recientes
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Verificar si la calificación es positiva (4-5 estrellas)
     */
    public function isPositive(): bool
    {
        return $this->rating >= 4;
    }

    /**
     * Verificar si la calificación es negativa (1-2 estrellas)
     */
    public function isNegative(): bool
    {
        return $this->rating <= 2;
    }

    /**
     * Obtener el texto de la calificación en estrellas
     */
    public function getStarsTextAttribute(): string
    {
        return str_repeat('⭐', $this->rating);
    }
}
