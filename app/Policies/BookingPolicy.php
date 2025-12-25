<?php

namespace App\Policies;

use App\Models\Booking;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BookingPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Booking $booking): bool
    {
        // User can view their own bookings
        if ($booking->user_id === $user->id) {
            return true;
        }
        
        // Supplier can view bookings for their activities
        if ($booking->activity && $booking->activity->supplier_id === $user->id) {
            return true;
        }
        
        // Admin can view all bookings
        if ($user->role === 'admin') {
            return true;
        }
        
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(?User $user): bool
    {
        return true; // Anyone can create bookings
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(User $user, Booking $booking): bool
    {
        // Only booking owner can cancel
        if ($booking->user_id !== $user->id) {
            return false;
        }
        
        // Check if booking can be cancelled
        return $booking->canBeCancelled();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Booking $booking): bool
    {
        // Supplier can update bookings for their activities
        if ($booking->activity && $booking->activity->supplier_id === $user->id) {
            return true;
        }
        
        // Admin can update
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can confirm the booking.
     */
    public function confirm(User $user, Booking $booking): bool
    {
        // Only supplier or admin can confirm
        if ($booking->activity && $booking->activity->supplier_id === $user->id) {
            return $booking->canBeConfirmed();
        }
        
        if ($user->role === 'admin') {
            return $booking->canBeConfirmed();
        }
        
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Booking $booking): bool
    {
        return $user->role === 'admin';
    }
}
