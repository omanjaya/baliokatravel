<?php
// app/Models/ActivityAvailability.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityAvailability extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'activity_id',
        'date',
        'start_time',
        'end_time',
        'total_spots',
        'available_spots',
        'price_override_idr',
        'price_override_usd',
        'status',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'price_override_idr' => 'decimal:0',
            'price_override_usd' => 'decimal:2',
        ];
    }

    // Relationships
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'availability_id');
    }

    // Scopes
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeAvailable($query)
    {
        return $query->where('available_spots', '>', 0)
                    ->where('status', 'open');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', now()->toDateString());
    }

    // Helpers
    public function isFull(): bool
    {
        return $this->available_spots <= 0;
    }

    public function isOpen(): bool
    {
        return $this->status === 'open';
    }

    public function getEffectivePriceIdr(): float
    {
        return $this->price_override_idr ?? $this->activity->price_idr;
    }

    public function getEffectivePriceUsd(): ?float
    {
        return $this->price_override_usd ?? $this->activity->price_usd;
    }
}
