<?php

namespace App\Listeners;

use App\Events\BookingConfirmed;
use App\Mail\BookingConfirmation;
use App\Notifications\BookingConfirmedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendBookingConfirmationEmail implements ShouldQueue
{
    public function handle(BookingConfirmed $event): void
    {
        $booking = $event->booking->load(['activity.area', 'user']);

        // Send notification to user if logged in
        if ($booking->user) {
            $booking->user->notify(new BookingConfirmedNotification($booking));
        }

        // Also send mailable to contact email (in case different or guest booking)
        if ($booking->contact_email) {
            Mail::to($booking->contact_email)
                ->send(new BookingConfirmation($booking));
        }
    }
}
