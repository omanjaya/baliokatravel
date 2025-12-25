<?php
// app/Actions/Booking/ConfirmBooking.php

namespace App\Actions\Booking;

use App\Enums\BookingStatus;
use App\Models\Booking;

class ConfirmBooking
{
    public function __invoke(Booking $booking): Booking
    {
        if (!$booking->canBeConfirmed()) {
            throw new \LogicException("Booking {$booking->reference} cannot be confirmed.");
        }
        
        $booking->update([
            'status' => BookingStatus::Confirmed,
            'confirmed_at' => now(),
        ]);
        
        // TODO: Dispatch BookingConfirmed event
        // BookingConfirmed::dispatch($booking);
        
        return $booking->fresh();
    }
}
