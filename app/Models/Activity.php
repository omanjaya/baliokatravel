<?php
// app/Models/Activity.php

namespace App\Models;

use App\Enums\ActivityStatus;
use App\Enums\Difficulty;
use App\Enums\CancellationPolicy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Activity extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'title',
        'slug',
        'description',
        'short_description',
        'area_id',
        'category_id',
        'meeting_point',
        'meeting_point_lat',
        'meeting_point_lng',
        'meeting_point_instructions',
        'duration_minutes',
        'min_group_size',
        'max_group_size',
        'min_age',
        'price_idr',
        'price_usd',
        'child_price_idr',
        'child_price_usd',
        'cover_image',
        'images',
        'video_url',
        'highlights',
        'included',
        'excluded',
        'requirements',
        'what_to_bring',
        'languages',
        'difficulty',
        'cancellation_policy',
        'instant_booking',
        'status',
        'rejection_reason',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'highlights' => 'array',
            'included' => 'array',
            'excluded' => 'array',
            'requirements' => 'array',
            'what_to_bring' => 'array',
            'languages' => 'array',
            'instant_booking' => 'boolean',
            'is_featured' => 'boolean',
            'price_idr' => 'decimal:0',
            'price_usd' => 'decimal:2',
            'rating_average' => 'decimal:1',
            'status' => ActivityStatus::class,
            'difficulty' => Difficulty::class,
            'cancellation_policy' => CancellationPolicy::class,
            'published_at' => 'datetime',
        ];
    }

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($activity) {
            if (!$activity->slug) {
                $activity->slug = Str::slug($activity->title);
            }
        });
    }

    // Relationships
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function area()
    {
        return $this->belongsTo(BaliArea::class, 'area_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function availabilities()
    {
        return $this->hasMany(ActivityAvailability::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', ActivityStatus::Published);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInArea($query, string $areaId)
    {
        return $query->where('area_id', $areaId);
    }

    public function scopeInCategory($query, string $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Helpers
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price_idr, 0, ',', '.');
    }

    public function getFormattedDurationAttribute(): string
    {
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours && $minutes) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours) {
            return "{$hours}h";
        }
        return "{$minutes}m";
    }

    public function updateRating(): void
    {
        $this->rating_average = $this->reviews()->avg('rating') ?? 0;
        $this->review_count = $this->reviews()->count();
        $this->save();
    }
}
