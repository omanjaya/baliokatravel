<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\BaliArea;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'featuredActivities' => Activity::with(['area', 'category', 'supplier'])
                ->published()
                ->featured()
                ->latest()
                ->limit(6)
                ->get(),
            'areas' => BaliArea::all(),
            'categories' => Category::orderBy('display_order')->get(),
        ]);
    }
}
