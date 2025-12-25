<?php

namespace App\Actions\Review;

use App\Models\Activity;
use App\Models\Booking;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateReview
{
    /**
     * Create a new review for an activity
     */
    public function __invoke(
        Activity $activity,
        User $user,
        int $rating,
        string $content,
        ?string $title = null,
        ?Booking $booking = null,
        ?array $photos = null
    ): Review {
        // Verify user has completed booking for this activity
        if ($booking) {
            if ($booking->user_id !== $user->id || $booking->activity_id !== $activity->id) {
                throw new \InvalidArgumentException('Invalid booking for this review.');
            }
            
            if ($booking->status !== 'completed') {
                throw new \LogicException('Can only review completed bookings.');
            }
            
            // Check if already reviewed this booking
            if (Review::where('booking_id', $booking->id)->exists()) {
                throw new \LogicException('You have already reviewed this booking.');
            }
        }

        return DB::transaction(function () use ($activity, $user, $rating, $content, $title, $booking, $photos) {
            // Create the review
            $review = Review::create([
                'activity_id' => $activity->id,
                'user_id' => $user->id,
                'booking_id' => $booking?->id,
                'rating' => $rating,
                'title' => $title,
                'content' => $content,
                'photos' => $photos,
                'status' => 'published', // Auto-publish verified reviews
            ]);

            // Update activity rating
            $this->updateActivityRating($activity);

            return $review;
        });
    }

    /**
     * Update activity's average rating and review count
     */
    private function updateActivityRating(Activity $activity): void
    {
        $stats = Review::where('activity_id', $activity->id)
            ->where('status', 'published')
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as count')
            ->first();

        $activity->update([
            'rating_average' => round($stats->avg_rating ?? 0, 1),
            'review_count' => $stats->count ?? 0,
        ]);
    }
}
