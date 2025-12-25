<?php

namespace App\Queries;

use App\Models\Activity;
use App\Models\Review;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ReviewQueries
{
    /**
     * Get reviews for an activity with pagination
     */
    public function forActivity(
        Activity $activity,
        ?int $rating = null,
        string $sort = 'recent',
        int $perPage = 10
    ): LengthAwarePaginator {
        return Review::with(['user', 'booking'])
            ->where('activity_id', $activity->id)
            ->where('status', 'published')
            ->when($rating, fn ($q) => $q->where('rating', $rating))
            ->orderBy(
                match ($sort) {
                    'helpful' => 'helpful_count',
                    'rating_high' => 'rating',
                    'rating_low' => 'rating',
                    default => 'created_at',
                },
                match ($sort) {
                    'rating_low' => 'asc',
                    default => 'desc',
                }
            )
            ->paginate($perPage);
    }

    /**
     * Get reviews by a user
     */
    public function forUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return Review::with(['activity.area', 'booking'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate($perPage);
    }

    /**
     * Get review statistics for an activity
     */
    public function getActivityStats(Activity $activity): array
    {
        $reviews = Review::where('activity_id', $activity->id)
            ->where('status', 'published')
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();

        $total = array_sum($reviews);
        
        return [
            'total' => $total,
            'average' => $activity->rating_average,
            'distribution' => [
                5 => $reviews[5] ?? 0,
                4 => $reviews[4] ?? 0,
                3 => $reviews[3] ?? 0,
                2 => $reviews[2] ?? 0,
                1 => $reviews[1] ?? 0,
            ],
            'percentages' => $total > 0 ? [
                5 => round((($reviews[5] ?? 0) / $total) * 100),
                4 => round((($reviews[4] ?? 0) / $total) * 100),
                3 => round((($reviews[3] ?? 0) / $total) * 100),
                2 => round((($reviews[2] ?? 0) / $total) * 100),
                1 => round((($reviews[1] ?? 0) / $total) * 100),
            ] : [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0],
        ];
    }

    /**
     * Get featured reviews for homepage
     */
    public function getFeatured(int $limit = 6): Collection
    {
        return Review::with(['user', 'activity.area'])
            ->where('status', 'published')
            ->where('rating', '>=', 4)
            ->whereNotNull('content')
            ->where('content', '!=', '')
            ->orderByDesc('helpful_count')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Check if user can review a booking
     */
    public function canUserReview(User $user, Activity $activity, ?string $bookingId = null): array
    {
        // Check for completed booking
        $completedBooking = $user->bookings()
            ->where('activity_id', $activity->id)
            ->where('status', 'completed')
            ->when($bookingId, fn ($q) => $q->where('id', $bookingId))
            ->first();

        if (!$completedBooking) {
            return [
                'can_review' => false,
                'reason' => 'You need a completed booking to write a review.',
            ];
        }

        // Check if already reviewed
        $existingReview = Review::where('user_id', $user->id)
            ->where('booking_id', $completedBooking->id)
            ->first();

        if ($existingReview) {
            return [
                'can_review' => false,
                'reason' => 'You have already reviewed this booking.',
                'existing_review' => $existingReview,
            ];
        }

        return [
            'can_review' => true,
            'booking' => $completedBooking,
        ];
    }
}
