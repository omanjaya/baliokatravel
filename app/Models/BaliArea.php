<?php
// app/Models/BaliArea.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BaliArea extends Model
{
    use HasFactory;

    // Use string ID instead of auto-increment
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'name_id',
        'description',
        'image_url',
        'latitude',
        'longitude',
        'popular_for',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'popular_for' => 'array',
            'is_active' => 'boolean',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
        ];
    }

    // Relationships
    public function activities()
    {
        return $this->hasMany(Activity::class, 'area_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
