<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ContractorTag extends Pivot
{
    protected $table = 'contractor_tag';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'contractor_user_id',
        'tag_id',
    ];

    public function contractor()
    {
        return $this->belongsTo(Contractor::class, 'contractor_user_id', 'user_id');
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }
}
