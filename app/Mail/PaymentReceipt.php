<?php

namespace App\Mail;

use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PaymentReceipt extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
        public Payment $payment,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Payment Receipt - {$this->booking->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payment.receipt',
            with: [
                'booking' => $this->booking,
                'payment' => $this->payment,
                'activity' => $this->booking->activity,
                'formattedAmount' => 'Rp ' . number_format((float) $this->payment->amount, 0, ',', '.'),
                'paidAt' => $this->payment->paid_at?->format('F j, Y \a\t g:i A'),
            ],
        );
    }
}
