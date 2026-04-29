<?php

namespace App\Observers;

use App\Models\Contractor;

class ContractorObserver
{
    /**
     * Handle the Contractor "creating" event.
     */
    public function creating(Contractor $contractor): void
    {
        // Set default values if not provided
        if (is_null($contractor->country_code)) {
            $contractor->country_code = 'BO'; // Default to Bolivia
        }

        if (is_null($contractor->contract_status)) {
            $contractor->contract_status = Contractor::STATUS_PENDING;
        }

        if (is_null($contractor->affiliation_date)) {
            $contractor->affiliation_date = now()->toDateString();
        }

        // Generate a unique license number if not provided
        if (empty($contractor->license_number)) {
            $contractor->license_number = 'LIC-' . now()->format('Y') . '-' . strtoupper(uniqid());
        }
    }

    /**
     * Handle the Contractor "created" event.
     */
    public function created(Contractor $contractor): void
    {
        // Log contractor creation or send notifications
        \Log::info("New contractor created: {$contractor->company_name} (ID: {$contractor->user_id})");
    }

    /**
     * Handle the Contractor "updated" event.
     */
    public function updated(Contractor $contractor): void
    {
        // Log important status changes
        if ($contractor->wasChanged('contract_status')) {
            $oldStatus = $contractor->getOriginal('contract_status');
            $newStatus = $contractor->contract_status;
            
            \Log::info("Contractor {$contractor->company_name} status changed from {$oldStatus} to {$newStatus}");
            
            // Set approval date when approved
            if ($newStatus === Contractor::STATUS_APPROVED && empty($contractor->approval_date)) {
                $contractor->update(['approval_date' => now()->toDateString()]);
            }
        }
    }

    /**
     * Handle the Contractor "deleted" event.
     */
    public function deleted(Contractor $contractor): void
    {
        \Log::info("Contractor deleted: {$contractor->company_name} (ID: {$contractor->user_id})");
    }

    /**
     * Handle the Contractor "restored" event.
     */
    public function restored(Contractor $contractor): void
    {
        \Log::info("Contractor restored: {$contractor->company_name} (ID: {$contractor->user_id})");
    }

    /**
     * Handle the Contractor "force deleted" event.
     */
    public function forceDeleted(Contractor $contractor): void
    {
        \Log::info("Contractor permanently deleted: {$contractor->company_name} (ID: {$contractor->user_id})");
    }
}