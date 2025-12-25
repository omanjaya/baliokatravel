<?php
// app/Models/User.php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'business_name',
        'business_description',
        'business_phone',
        'business_email',
        'business_address',
        'is_verified_supplier',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_verified_supplier' => 'boolean',
        ];
    }

    // Relationships
    public function activities()
    {
        return $this->hasMany(Activity::class, 'supplier_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isSupplier(): bool
    {
        return $this->role === UserRole::Supplier;
    }

    public function isTraveler(): bool
    {
        return $this->role === UserRole::Traveler;
    }

    // Filament
    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'admin') {
            return $this->isAdmin();
        }

        if ($panel->getId() === 'supplier') {
            return $this->isSupplier();
        }

        return false;
    }
}
