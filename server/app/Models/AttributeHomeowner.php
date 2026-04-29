<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeHomeowner extends Model
{
    use HasFactory;

    protected $table = 'attribute_homeowner';

    protected $fillable = [
        'homeowner_id',
        'attribute_id',
        'value',
        'status',
        'coment',
    ];

    public function homeowner()
    {
        return $this->belongsTo(HomeownerProfile::class, 'homeowner_id', 'user_id');
    }

    public function attribute()
    {
        return $this->belongsTo(AttributeModel::class, 'attribute_id');
    }
}
