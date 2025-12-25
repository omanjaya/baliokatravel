<?php
// app/Actions/Booking/CancelBooking.php

namespace App\Actions\Booking;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Support\Facades\DB;

class CancelBooking
{
    public function __invoke(Booking $booking, ?string $reason = null, bool $initiatedByCustomer = true): Booking
    {
        if (!$booking->canBeCancelled()) {
            throw new \LogicException("Booking {$booking->reference} cannot be cancelled.");
        }
        
        return DB::transaction(function () use ($booking, $reason, $initiatedByCustomer) {
            // Restore availability spots
            if ($booking->availability) {
                $booking->availability->increment('available_spots', $booking->total_participants);
                
                // Reopen if was full
                if ($booking->availability->status === 'full') {
                    $booking->availability->update(['status' => 'open']);
                }
            }
            
            $booking->update([
                'status' => BookingStatus::Cancelled,
                'cancelled_at' => now(),
                'cancellation_reason' => $reason,
                'cancelled_by_customer' => $initiatedByCustomer,
            ]);
            
            // TODO: Handle refund if payment was made
            // TODO: Dispatch BookingCancelled event
            
            return $booking->fresh();
        });
    }
    
    /**
     * Check if booking is within free cancellation window (24h before)
     */
    public function isFreeCancellation(Booking $booking): bool
    {
        if (!$booking->booking_date || !$booking->booking_time) {
            return false;
        }
        
        $bookingDateTime = \Carbon\Carbon::parse(
            $booking->booking_date . ' ' . $booking->booking_time
        );
        
        return now()->diffInHours($bookingDateTime, false) >= 24;
    }
}
