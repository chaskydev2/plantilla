<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TextBlock extends Model
{
    use HasFactory;

    protected $fillable = [
        'text_primary',
        'text_secondary',
        'text_tertiary',
    ];
}
