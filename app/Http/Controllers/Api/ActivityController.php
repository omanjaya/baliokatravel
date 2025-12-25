<?php

namespace App\Http\Controllers\Api;

use App\DTOs\SearchFiltersData;
use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\AvailabilityResource;
use App\Http\Resources\ReviewResource;
use App\Models\Activity;
use App\Queries\ActivityQueries;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function __construct(
        private ActivityQueries $activityQueries,
    ) {}

    /**
     * Search activities with filters
     */
    public function index(Request $request)
    {
        $filters = SearchFiltersData::fromRequest($request);
        $activities = $this->activityQueries->search($filters);

        return ActivityResource::collection($activities);
    }

    /**
     * Get featured activities
     */
    public function featured(Request $request)
    {
        $limit = $request->input('limit', 6);

        $activities = Activity::with(['area', 'category', 'supplier'])
            ->published()
            ->featured()
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json([
            'data' => ActivityResource::collection($activities),
        ]);
    }

    /**
     * Get single activity by slug
     */
    public function show(string $slug)
    {
        $activity = $this->activityQueries->findBySlug($slug);

        if (!$activity) {
            return response()->json([
                'message' => 'Activity not found',
            ], 404);
        }

        return response()->json([
            'data' => new ActivityResource($activity),
        ]);
    }

    /**
     * Get activity availability
     */
    public function availability(string $slug, Request $request)
    {
        $activity = Activity::where('slug', $slug)->first();

        if (!$activity) {
            return response()->json([
                'message' => 'Activity not found',
            ], 404);
        }

        $month = $request->input('month');
        $query = $activity->availabilities()
            ->where('status', 'open')
            ->where('date', '>=', now()->toDateString());

        if ($month) {
            $query->whereMonth('date', substr($month, 5, 2))
                  ->whereYear('date', substr($month, 0, 4));
        }

        $availabilities = $query->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => AvailabilityResource::collection($availabilities),
        ]);
    }

    /**
     * Get activity reviews
     */
    public function reviews(string $slug, Request $request)
    {
        $activity = Activity::where('slug', $slug)->first();

        if (!$activity) {
            return response()->json([
                'message' => 'Activity not found',
            ], 404);
        }

        $reviews = $activity->reviews()
            ->with('user:id,name,avatar')
            ->where('status', 'published')
            ->latest()
            ->paginate(10);

        return ReviewResource::collection($reviews);
    }
}
