<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeContractor extends Model
{
    use HasFactory;

    protected $table = 'attribute_contractor';

    protected $fillable = [
        'contractor_id',
        'attribute_id',
        'value',
        'status',
        'coment',
        'created_at',
        'updated_at',
    ];

    // Relaciones
    public function contractor()
    {
        return $this->belongsTo(Contractor::class, 'contractor_id', 'user_id');
    }

    public function attribute()
    {
        return $this->belongsTo(AttributeModel::class, 'attribute_id');
    }

}
