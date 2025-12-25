<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'recentBookings' => Booking::with(['activity.area'])
                ->where('user_id', auth()->id())
                ->latest()
                ->limit(5)
                ->get(),
            'stats' => [
                'total_bookings' => Booking::where('user_id', auth()->id())->count(),
                'upcoming_bookings' => Booking::where('user_id', auth()->id())
                    ->whereIn('status', ['confirmed', 'pending'])
                    ->count(),
                'completed_bookings' => Booking::where('user_id', auth()->id())
                    ->where('status', 'completed')
                    ->count(),
            ],
        ]);
    }

    public function bookings()
    {
        return Inertia::render('Dashboard/Bookings/Index', [
            'bookings' => Booking::with(['activity.area'])
                ->where('user_id', auth()->id())
                ->latest()
                ->paginate(10),
        ]);
    }
}
