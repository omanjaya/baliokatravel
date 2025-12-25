<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Notifications\BookingReminderNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendBookingReminders extends Command
{
    protected $signature = 'bookings:send-reminders';

    protected $description = 'Send reminder emails for bookings happening tomorrow';

    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow()->toDateString();
        
        $bookings = Booking::with(['activity', 'user'])
            ->where('status', 'confirmed')
            ->where('booking_date', $tomorrow)
            ->get();

        $this->info("Found {$bookings->count()} bookings for tomorrow ({$tomorrow})");

        foreach ($bookings as $booking) {
            try {
                // Send to user if they exist
                if ($booking->user) {
                    $booking->user->notify(new BookingReminderNotification($booking));
                }
                
                // Also send to contact email if different
                if ($booking->contact_email && (!$booking->user || $booking->contact_email !== $booking->user->email)) {
                    \Illuminate\Support\Facades\Mail::to($booking->contact_email)
                        ->send(new \App\Mail\BookingReminder($booking));
                }
                
                $this->line("✓ Sent reminder for booking: {$booking->reference}");
                
            } catch (\Exception $e) {
                $this->error("✗ Failed to send reminder for {$booking->reference}: {$e->getMessage()}");
                Log::error("Booking reminder failed", [
                    'booking_id' => $booking->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info('Booking reminders sent successfully!');
        
        return Command::SUCCESS;
    }
}
