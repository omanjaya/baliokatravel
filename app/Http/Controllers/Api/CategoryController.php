<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index()
    {
        $categories = Category::orderBy('display_order')->get();

        return response()->json([
            'data' => CategoryResource::collection($categories),
        ]);
    }

    /**
     * Get activities by category
     */
    public function activities(string $slug, Request $request)
    {
        $category = Category::where('slug', $slug)->first();

        if (!$category) {
            return response()->json([
                'message' => 'Category not found',
            ], 404);
        }

        $activities = $category->activities()
            ->with(['area', 'category', 'supplier'])
            ->published()
            ->paginate(12);

        return ActivityResource::collection($activities);
    }
}
