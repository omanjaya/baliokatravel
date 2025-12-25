<?php
// app/Models/Booking.php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Booking extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'reference',
        'user_id',
        'activity_id',
        'availability_id',
        'status',
        'participants',
        'participant_details',
        'total_participants',
        'contact_name',
        'contact_email',
        'contact_phone',
        'special_requests',
        'currency',
        'unit_price',
        'subtotal',
        'service_fee',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'promo_code',
        'booking_date',
        'booking_time',
        'confirmed_at',
        'cancelled_at',
        'completed_at',
        'cancellation_reason',
        'cancelled_by_customer',
        'supplier_notes',
    ];

    protected function casts(): array
    {
        return [
            'participants' => 'array',
            'participant_details' => 'array',
            'status' => BookingStatus::class,
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'service_fee' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'booking_date' => 'date',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
            'cancelled_by_customer' => 'boolean',
        ];
    }

    // Auto-generate reference
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($booking) {
            if (!$booking->reference) {
                $booking->reference = self::generateReference();
            }
        });
    }

    public static function generateReference(): string
    {
        $prefix = config('baliokatravel.booking.prefix', 'BOT');
        $year = date('Y');
        $random = strtoupper(Str::random(6));

        return "{$prefix}-{$year}-{$random}";
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function availability()
    {
        return $this->belongsTo(ActivityAvailability::class, 'availability_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // Status Helpers
    public function isPending(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    public function isConfirmed(): bool
    {
        return $this->status === BookingStatus::Confirmed;
    }

    public function isCancelled(): bool
    {
        return $this->status === BookingStatus::Cancelled;
    }

    public function isCompleted(): bool
    {
        return $this->status === BookingStatus::Completed;
    }

    public function canBeConfirmed(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed]);
    }

    public function canCancel(): bool
    {
        return $this->canBeCancelled();
    }

    public function canReview(): bool
    {
        return $this->status === BookingStatus::Completed && !$this->review;
    }

    // Price Helpers
    public function getFormattedTotalAttribute(): string
    {
        return 'Rp ' . number_format((float) $this->total_amount, 0, ',', '.');
    }
}
