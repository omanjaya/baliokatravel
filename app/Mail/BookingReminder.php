<?php

namespace App\Mail;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingReminder extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Booking $booking,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Reminder: Your Bali Adventure is Tomorrow! - {$this->booking->reference}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.booking.reminder',
            with: [
                'booking' => $this->booking,
                'activity' => $this->booking->activity,
                'formattedDate' => $this->booking->booking_date 
                    ? \Carbon\Carbon::parse($this->booking->booking_date)->format('l, F j, Y')
                    : 'Tomorrow',
                'formattedTime' => $this->booking->booking_time ?? 'Check your confirmation email',
                'meetingPoint' => $this->booking->activity->meeting_point ?? 'Contact supplier for details',
            ],
        );
    }
}
