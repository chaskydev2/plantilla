<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class UserObserver
{
    public function creating(User $user)
    {
        $user->created_id = Auth::id();
    }

    public function updating(User $user)
    {
        $user->updated_id = Auth::id();
    }

    public function deleted(User $user): void
    {
        $user->deleted_id = Auth::id();
        $user->restored_id = null;
        $user->restored_at = null;
        $user->save();
    }

    public function restored(User $user): void
    {
        $user->deleted_id = null;
        $user->restored_id = Auth::id();
        $user->restored_at = Carbon::now();
        $user->save();
    }
}
