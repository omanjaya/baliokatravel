<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\BaliArea;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AreaController extends Controller
{
    public function show(BaliArea $area)
    {
        return Inertia::render('Areas/Show', [
            'area' => $area,
            'activities' => Activity::with(['area', 'category', 'supplier'])
                ->published()
                ->inArea($area->id)
                ->paginate(12),
        ]);
    }
}
