<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Contractor;
use App\Observers\UserObserver;
use App\Observers\ContractorObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(UserObserver::class);
        Contractor::observe(ContractorObserver::class);

        //Gate::policy(User::class, UserPolicy::class);
    }
}
