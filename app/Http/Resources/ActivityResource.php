<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'area' => new AreaResource($this->whenLoaded('area')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'supplier' => new UserResource($this->whenLoaded('supplier')),
            'duration_minutes' => $this->duration_minutes,
            'min_group_size' => $this->min_group_size,
            'max_group_size' => $this->max_group_size,
            'min_age' => $this->min_age,
            'price_idr' => $this->price_idr,
            'price_usd' => $this->price_usd,
            'child_price_idr' => $this->child_price_idr,
            'cover_image' => $this->cover_image,
            'images' => $this->images,
            'video_url' => $this->video_url,
            'highlights' => $this->highlights,
            'included' => $this->included,
            'excluded' => $this->excluded,
            'languages' => $this->languages,
            'difficulty' => $this->difficulty,
            'rating_average' => (float) $this->rating_average,
            'review_count' => (int) $this->review_count,
            'is_featured' => (bool) $this->is_featured,
            'instant_booking' => (bool) $this->instant_booking,
            'cancellation_policy' => $this->cancellation_policy,
            'meeting_point' => $this->meeting_point,
            'meeting_point_lat' => $this->meeting_point_lat,
            'meeting_point_lng' => $this->meeting_point_lng,
            'meeting_point_instructions' => $this->meeting_point_instructions,
        ];
    }
}
