<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\ContractorProfession;
use App\Models\Service;
use Illuminate\Support\Facades\Config;

class UserNotification extends Model
{
    protected $table = 'user_notifications';

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'url',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function markAsRead(): bool
    {
        $this->read_at = now();
        return (bool) $this->save();
    }

    /**
     * Notify all homeowners registered for services related to the contractor's professions.
     * Creates a single notification per homeowner with a link to the contractor.
     *
     * @param int $contractorUserId
     * @return void
     */
    public static function notifyHomeownersForContractor(int $contractorUserId): void
    {
        // Get professions -> services for the contractor
        $contractorProfessions = ContractorProfession::where('contractor_user_id', $contractorUserId)
            ->with('profession.service')
            ->get();

        $services = $contractorProfessions->map(function ($cp) {
            return $cp->profession->service ?? null;
        })->filter()->unique('id')->values();

        if ($services->isEmpty()) {
            return;
        }

        // Collect homeowner user_ids across all services
        $homeownerUserIds = collect();

        foreach ($services as $service) {
            $ids = $service->homeownerProfiles()->pluck('user_id');
            $homeownerUserIds = $homeownerUserIds->merge($ids);
        }

        $homeownerUserIds = $homeownerUserIds->unique()->values();

        if ($homeownerUserIds->isEmpty()) {
            return;
        }

        $appUrl = rtrim(Config::get('app.url', ''), '/');
        $url = $appUrl . '/findpro/contractor/' . $contractorUserId;

        $title = 'new contractor registered';
        $message = 'A new contractor offering a service you follow has been registered.';

        foreach ($homeownerUserIds as $userId) {
            try {
                self::create([
                    'user_id' => $userId,
                    'title' => $title,
                    'message' => $message,
                    'url' => $url,
                    'data' => ['contractor_user_id' => $contractorUserId],
                ]);
            } catch (\Throwable $e) {
                // ignore individual failures
                continue;
            }
        }
    }
}
