<?php

namespace App\Http\Controllers;

use App\DTOs\SearchFiltersData;
use App\Models\Activity;
use App\Models\BaliArea;
use App\Models\Category;
use App\Queries\ActivityQueries;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function __construct(
        private ActivityQueries $activityQueries,
    ) {}

    public function show(string $slug)
    {
        $activity = $this->activityQueries->findBySlug($slug);
        
        if (!$activity) {
            abort(404);
        }

        $similarActivities = $this->activityQueries->similar($activity, 4);

        return Inertia::render('Activities/Show', [
            'activity' => $activity,
            'availabilities' => $activity->availabilities,
            'reviews' => $activity->reviews()
                ->with('user:id,name,avatar')
                ->latest()
                ->limit(10)
                ->get(),
            'similarActivities' => $similarActivities,
        ]);
    }

    public function search(Request $request)
    {
        $filters = SearchFiltersData::fromRequest($request);
        $activities = $this->activityQueries->search($filters);
        
        return Inertia::render('Search', [
            'activities' => $activities,
            'filters' => $filters->toArray(),
            'areas' => BaliArea::orderBy('name')->get(),
            'categories' => Category::orderBy('display_order')->get(),
        ]);
    }
}
