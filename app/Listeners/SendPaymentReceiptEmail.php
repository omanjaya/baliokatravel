<?php

namespace App\Listeners;

use App\Events\PaymentCompleted;
use App\Mail\PaymentReceipt;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class SendPaymentReceiptEmail implements ShouldQueue
{
    public function handle(PaymentCompleted $event): void
    {
        $payment = $event->payment->load(['booking.activity', 'booking.user']);
        $booking = $payment->booking;

        if ($booking->contact_email) {
            Mail::to($booking->contact_email)
                ->send(new PaymentReceipt($booking, $payment));
        }
    }
}
