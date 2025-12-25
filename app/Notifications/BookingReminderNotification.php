<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingReminderNotification extends Notification implements ShouldQueue
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
        $booking = $this->booking->load(['activity']);
        $activity = $booking->activity;
        
        return (new MailMessage)
            ->subject("Reminder: Your Bali Adventure is Tomorrow! - {$booking->reference}")
            ->greeting("Hello {$booking->contact_name}!")
            ->line('This is a friendly reminder that your adventure is **tomorrow**!')
            ->line("**{$activity->title}**")
            ->line("📅 Date: " . \Carbon\Carbon::parse($booking->booking_date)->format('l, F j, Y'))
            ->line("⏰ Time: " . ($booking->booking_time ?? 'Check your confirmation email'))
            ->line("📍 Meeting Point: " . ($activity->meeting_point ?? 'Contact supplier for details'))
            ->line('')
            ->line("**Don't forget to bring:**")
            ->line('- This confirmation or booking reference: **' . $booking->reference . '**')
            ->line('- Valid ID/Passport')
            ->line('- Comfortable clothing')
            ->action('View Booking Details', url("/dashboard/bookings/{$booking->id}"))
            ->line('We can\'t wait to see you tomorrow!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'booking_id' => $this->booking->id,
            'reference' => $this->booking->reference,
        ];
    }
}
