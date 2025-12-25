<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\AreaResource;
use App\Models\BaliArea;
use Illuminate\Http\Request;

class AreaController extends Controller
{
    /**
     * Get all areas
     */
    public function index()
    {
        $areas = BaliArea::orderBy('name')->get();

        return response()->json([
            'data' => AreaResource::collection($areas),
        ]);
    }

    /**
     * Get activities by area
     */
    public function activities(string $slug, Request $request)
    {
        $area = BaliArea::where('slug', $slug)->first();

        if (!$area) {
            return response()->json([
                'message' => 'Area not found',
            ], 404);
        }

        $activities = $area->activities()
            ->with(['area', 'category', 'supplier'])
            ->published()
            ->paginate(12);

        return ActivityResource::collection($activities);
    }
}
