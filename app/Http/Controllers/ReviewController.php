<?php

namespace App\Http\Controllers;

use App\Actions\Review\CreateReview;
use App\Http\Requests\StoreReviewRequest;
use App\Models\Activity;
use App\Models\Booking;
use App\Models\Review;
use App\Queries\ReviewQueries;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private CreateReview $createReview,
        private ReviewQueries $reviewQueries,
    ) {}

    /**
     * Show reviews for an activity (API)
     */
    public function index(Activity $activity, Request $request): JsonResponse
    {
        $reviews = $this->reviewQueries->forActivity(
            activity: $activity,
            rating: $request->input('rating'),
            sort: $request->input('sort', 'recent'),
            perPage: $request->input('per_page', 10),
        );

        $stats = $this->reviewQueries->getActivityStats($activity);

        return response()->json([
            'reviews' => $reviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Show review creation form
     */
    public function create(Activity $activity, Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $check = $this->reviewQueries->canUserReview(
            $user, 
            $activity, 
            $request->query('booking_id')
        );

        if (!$check['can_review']) {
            return redirect()
                ->route('activities.show', $activity->slug)
                ->with('error', $check['reason']);
        }

        return Inertia::render('Reviews/Create', [
            'activity' => $activity->load('area'),
            'booking' => $check['booking'] ?? null,
        ]);
    }

    /**
     * Store a new review
     */
    public function store(StoreReviewRequest $request, Activity $activity)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $booking = null;
        if ($request->booking_id) {
            $booking = Booking::findOrFail($request->booking_id);
        }

        // Handle photo uploads
        $photos = null;
        if ($request->hasFile('photos')) {
            $photos = [];
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('reviews', 'public');
                $photos[] = '/storage/' . $path;
            }
        }

        try {
            $review = ($this->createReview)(
                activity: $activity,
                user: $user,
                rating: $request->rating,
                content: $request->content,
                title: $request->title,
                booking: $booking,
                photos: $photos,
            );

            return redirect()
                ->route('activities.show', $activity->slug)
                ->with('success', 'Thank you for your review!');
        } catch (\Exception $e) {
            return back()
                ->withInput()
                ->with('error', $e->getMessage());
        }
    }

    /**
     * User's reviews list
     */
    public function userReviews(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        
        $reviews = $this->reviewQueries->forUser($user);

        return Inertia::render('Dashboard/Reviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    /**
     * Mark review as helpful (AJAX)
     */
    public function markHelpful(Review $review): JsonResponse
    {
        // Simple increment for now (can add user tracking later)
        $review->increment('helpful_count');

        return response()->json([
            'helpful_count' => $review->helpful_count,
        ]);
    }
}
