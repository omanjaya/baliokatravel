<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmation extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Booking Confirmed - {$this->booking->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking.confirmation',
            with: [
                'booking' => $this->booking,
                'activity' => $this->booking->activity,
                'availability' => $this->booking->availability,
                'formattedDate' => $this->booking->booking_date 
                    ? \Carbon\Carbon::parse($this->booking->booking_date)->format('l, F j, Y')
                    : 'TBD',
                'formattedTime' => $this->booking->booking_time ?? 'TBD',
                'formattedTotal' => 'Rp ' . number_format((float) $this->booking->total_amount, 0, ',', '.'),
            ],
        );
    }
}
