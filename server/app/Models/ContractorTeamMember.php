<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ContractorTeamMember extends Pivot
{
    protected $table = 'contractor_team_members';

    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'leader_user_id',
        'member_user_id',
        'status',
        'compania',
    ];

    public function leader()
    {
        return $this->belongsTo(Contractor::class, 'leader_user_id', 'user_id');
    }

    public function member()
    {
        return $this->belongsTo(Contractor::class, 'member_user_id', 'user_id');
    }
}
