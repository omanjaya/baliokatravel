<?php
// app/Models/Review.php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'activity_id',
        'booking_id',
        'user_id',
        'rating',
        'title',
        'content',
        'photos',
        'supplier_response',
        'supplier_responded_at',
        'status',
        'helpful_count',
        'reported_count',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'photos' => 'array',
            'supplier_responded_at' => 'datetime',
            'helpful_count' => 'integer',
            'reported_count' => 'integer',
        ];
    }

    // Relationships
    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeHighRated($query)
    {
        return $query->where('rating', '>=', 4);
    }

    public function scopeLowRated($query)
    {
        return $query->where('rating', '<=', 2);
    }

    public function scopeWithResponse($query)
    {
        return $query->whereNotNull('supplier_response');
    }

    // Helpers
    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function hasResponse(): bool
    {
        return !is_null($this->supplier_response);
    }

    public function isHighRated(): bool
    {
        return $this->rating >= 4;
    }

    public function isLowRated(): bool
    {
        return $this->rating <= 2;
    }
}
