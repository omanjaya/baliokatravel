<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'activity_id' => $this->activity_id,
            'booking_id' => $this->booking_id,
            'user_id' => $this->user_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'rating' => $this->rating,
            'title' => $this->title,
            'content' => $this->content,
            'photos' => $this->photos,
            'supplier_response' => $this->supplier_response,
            'supplier_responded_at' => $this->supplier_responded_at?->toIso8601String(),
            'status' => $this->status,
            'helpful_count' => $this->helpful_count,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
