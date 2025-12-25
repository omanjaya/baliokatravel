<?php
// app/Models/Payment.php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'booking_id',
        'amount',
        'currency',
        'stripe_amount',
        'stripe_currency',
        'payment_method',
        'stripe_payment_intent_id',
        'stripe_client_secret',
        'stripe_charge_id',
        'stripe_refund_id',
        'status',
        'failure_reason',
        'paid_at',
        'refunded_at',
        'refund_amount',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'stripe_amount' => 'integer',
            'refund_amount' => 'decimal:2',
            'status' => PaymentStatus::class,
            'paid_at' => 'datetime',
            'refunded_at' => 'datetime',
            'metadata' => 'array',
        ];
    }

    // Relationships
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', PaymentStatus::Pending);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', PaymentStatus::Completed);
    }

    public function scopeFailed($query)
    {
        return $query->where('status', PaymentStatus::Failed);
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', PaymentStatus::Refunded);
    }

    // Helpers
    public function isPending(): bool
    {
        return $this->status === PaymentStatus::Pending;
    }

    public function isCompleted(): bool
    {
        return $this->status === PaymentStatus::Completed;
    }

    public function isFailed(): bool
    {
        return $this->status === PaymentStatus::Failed;
    }

    public function isRefunded(): bool
    {
        return $this->status === PaymentStatus::Refunded;
    }

    public function canBeRefunded(): bool
    {
        return $this->isCompleted() && !$this->isRefunded();
    }

    public function getFormattedAmountAttribute(): string
    {
        if ($this->currency === 'IDR') {
            return 'Rp ' . number_format((float) $this->amount, 0, ',', '.');
        }
        return '$' . number_format((float) $this->amount, 2);
    }
}
