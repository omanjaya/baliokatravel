<?php

namespace App\Actions\Review;

use App\Models\Review;
use Illuminate\Support\Facades\DB;

class RespondToReview
{
    /**
     * Add a supplier response to a review
     */
    public function __invoke(Review $review, string $response, int $supplierId): Review
    {
        // Verify supplier owns the activity
        if ($review->activity->supplier_id !== $supplierId) {
            throw new \InvalidArgumentException('You can only respond to reviews for your own activities.');
        }

        // Check if already responded
        if ($review->hasResponse()) {
            throw new \LogicException('This review already has a response.');
        }

        $review->update([
            'supplier_response' => $response,
            'supplier_responded_at' => now(),
        ]);

        return $review->fresh();
    }
}
