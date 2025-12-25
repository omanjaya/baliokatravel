<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reference' => $this->reference,
            'activity' => new ActivityResource($this->whenLoaded('activity')),
            'availability' => new AvailabilityResource($this->whenLoaded('availability')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'status' => $this->status,
            'participants' => [
                'adults' => $this->adults,
                'children' => $this->children,
            ],
            'total_participants' => $this->adults + $this->children,
            'subtotal' => $this->subtotal,
            'service_fee' => $this->service_fee,
            'total_amount' => $this->total_amount,
            'currency' => $this->currency,
            'booking_date' => $this->availability?->date,
            'booking_time' => $this->availability?->start_time,
            'contact_name' => $this->contact_name,
            'contact_email' => $this->contact_email,
            'contact_phone' => $this->contact_phone,
            'special_requests' => $this->special_requests,
            'created_at' => $this->created_at->toIso8601String(),
            'confirmed_at' => $this->confirmed_at?->toIso8601String(),
            'cancelled_at' => $this->cancelled_at?->toIso8601String(),
        ];
    }
}
