<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;

trait HandlesIsoDateFormat
{
    /**
     * Create a date attribute that handles ISO 8601 format conversion
     */
    protected function createDateAttribute(string $field): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Carbon::parse($value)->format('Y-m-d') : null,
        );
    }

    /**
     * Create a datetime attribute that handles ISO 8601 format conversion
     */
    protected function createDateTimeAttribute(string $field): Attribute
    {
        return Attribute::make(
            set: fn ($value) => $value ? Carbon::parse($value)->format('Y-m-d H:i:s') : null,
        );
    }
}