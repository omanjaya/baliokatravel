<?php
// app/Actions/Booking/CreateBooking.php

namespace App\Actions\Booking;

use App\DTOs\BookingData;
use App\Enums\BookingStatus;
use App\Models\Activity;
use App\Models\ActivityAvailability;
use App\Models\Booking;
use App\Support\Helpers\BookingReferenceGenerator;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CreateBooking
{
    public function __construct(
        private CalculateBookingTotal $calculateTotal,
        private BookingReferenceGenerator $referenceGenerator,
    ) {}

    public function __invoke(BookingData $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $activity = Activity::with('area', 'category', 'supplier')
                ->findOrFail($data->activityId);
                
            $availability = ActivityAvailability::findOrFail($data->availabilityId);
            
            // Validate availability
            $this->validateAvailability($availability, $data->totalParticipants());
            
            // Validate group size
            $this->validateGroupSize($activity, $data->totalParticipants());
            
            // Calculate total
            $totals = ($this->calculateTotal)($activity, $data->participants);
            
            // Create booking
            $booking = Booking::create([
                'reference' => $this->referenceGenerator->generate(),
                'user_id' => $data->userId,
                'activity_id' => $data->activityId,
                'availability_id' => $data->availabilityId,
                'contact_name' => $data->contactName,
                'contact_email' => $data->contactEmail,
                'contact_phone' => $data->contactPhone,
                'participants' => $data->participants->toArray(),
                'total_participants' => $data->totalParticipants(),
                'subtotal' => $totals['subtotal'],
                'service_fee' => $totals['service_fee'],
                'total_amount' => $totals['total'],
                'currency' => 'IDR',
                'special_requests' => $data->specialRequests,
                'status' => BookingStatus::Pending,
                'booking_date' => $availability->date,
                'booking_time' => $availability->start_time,
            ]);
            
            // Reserve spots (temporarily)
            $availability->decrement('available_spots', $data->totalParticipants());
            
            // Check if fully booked
            if ($availability->available_spots <= 0) {
                $availability->update(['status' => 'full']);
            }
            
            // Load relationships for response
            $booking->load(['activity.area', 'activity.category', 'availability']);
            
            return $booking;
        });
    }
    
    private function validateAvailability(ActivityAvailability $availability, int $participants): void
    {
        if ($availability->status !== 'open') {
            throw new InvalidArgumentException('This time slot is no longer available.');
        }
        
        if ($availability->available_spots < $participants) {
            throw new InvalidArgumentException(
                "Not enough spots available. Only {$availability->available_spots} spots left."
            );
        }
    }
    
    private function validateGroupSize(Activity $activity, int $participants): void
    {
        if ($participants < ($activity->min_group_size ?? 1)) {
            throw new InvalidArgumentException(
                "Minimum group size is {$activity->min_group_size} participants."
            );
        }
        
        if ($participants > $activity->max_group_size) {
            throw new InvalidArgumentException(
                "Maximum group size is {$activity->max_group_size} participants."
            );
        }
    }
}
