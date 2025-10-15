<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContractorProfession extends Model
{
    /**
     * The table associated with the model.
     */
    protected $table = 'contractor_professions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'contractor_user_id',
        'profession_id'
    ];

    /**
     * Get the contractor that owns this profession relationship.
     */
    public function contractor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contractor_user_id', 'id');
    }

    /**
     * Get the profession that owns this contractor relationship.
     */
    public function profession(): BelongsTo
    {
        return $this->belongsTo(Profession::class, 'profession_id', 'id');
    }
}
