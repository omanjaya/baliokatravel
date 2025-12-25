<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Booking $booking,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $booking = $this->booking->load(['activity', 'availability']);
        $activity = $booking->activity;
        
        return (new MailMessage)
            ->subject("Booking Confirmed - {$booking->reference}")
            ->greeting("Hello {$booking->contact_name}!")
            ->line('Great news! Your booking has been confirmed.')
            ->line("**{$activity->title}**")
            ->line("📅 Date: " . ($booking->booking_date ? \Carbon\Carbon::parse($booking->booking_date)->format('l, F j, Y') : 'TBD'))
            ->line("⏰ Time: " . ($booking->booking_time ?? 'TBD'))
            ->line("👥 Participants: {$booking->total_participants}")
            ->line("📍 Location: " . ($activity->area?->name ?? 'Bali'))
            ->action('View Booking', url("/dashboard/bookings/{$booking->id}"))
            ->line('We can\'t wait for your Bali adventure!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'reference' => $this->booking->reference,
            'activity_title' => $this->booking->activity->title,
        ];
    }
}
