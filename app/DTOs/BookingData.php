<?php
// app/DTOs/BookingData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class BookingData
{
    public function __construct(
        public string $activityId,
        public string $availabilityId,
        public ParticipantsData $participants,
        public string $contactName,
        public string $contactEmail,
        public string $contactPhone,
        public ?string $specialRequests = null,
        public ?int $userId = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            activityId: $request->input('activity_id'),
            availabilityId: $request->input('availability_id'),
            participants: ParticipantsData::fromRequest($request),
            contactName: $request->input('contact_name'),
            contactEmail: $request->input('contact_email'),
            contactPhone: $request->input('contact_phone'),
            specialRequests: $request->input('special_requests'),
            userId: auth()->check() ? auth()->id() : null,
        );
    }

    public function totalParticipants(): int
    {
        return $this->participants->total();
    }

    public function toArray(): array
    {
        return [
            'activity_id' => $this->activityId,
            'availability_id' => $this->availabilityId,
            'participants' => $this->participants->toArray(),
            'contact_name' => $this->contactName,
            'contact_email' => $this->contactEmail,
            'contact_phone' => $this->contactPhone,
            'special_requests' => $this->specialRequests,
            'user_id' => $this->userId,
        ];
    }
}
