<?php

namespace App\Http\Controllers;

use App\Actions\Booking\CalculateBookingTotal;
use App\Actions\Booking\CancelBooking;
use App\Actions\Booking\CreateBooking;
use App\DTOs\BookingData;
use App\DTOs\ParticipantsData;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Activity;
use App\Models\Booking;
use App\Queries\ActivityQueries;
use App\Queries\BookingQueries;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        private CreateBooking $createBooking,
        private CancelBooking $cancelBooking,
        private CalculateBookingTotal $calculateTotal,
        private ActivityQueries $activityQueries,
        private BookingQueries $bookingQueries,
    ) {}

    /**
     * Show booking creation form
     */
    public function create(string $slug)
    {
        $activity = $this->activityQueries->findBySlug($slug);
        
        if (!$activity) {
            abort(404);
        }

        return Inertia::render('Booking/Create', [
            'activity' => $activity,
            'availabilities' => $activity->availabilities,
        ]);
    }

    /**
     * Store a new booking
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $data = BookingData::fromRequest($request);
            $booking = ($this->createBooking)($data);
            
            return redirect()
                ->route('booking.payment', $booking)
                ->with('success', 'Booking created! Please complete payment.');
                
        } catch (\InvalidArgumentException $e) {
            return back()
                ->withErrors(['availability' => $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Show payment page
     */
    public function payment(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['activity.area', 'activity.category', 'availability']);

        return Inertia::render('Booking/Payment', [
            'booking' => $booking,
        ]);
    }

    /**
     * Show confirmation page
     */
    public function confirmation(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['activity.area', 'activity.category', 'availability', 'payment']);

        return Inertia::render('Booking/Confirmation', [
            'booking' => $booking,
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, Booking $booking)
    {
        $this->authorize('cancel', $booking);

        try {
            $reason = $request->input('reason');
            ($this->cancelBooking)($booking, $reason, true);
            
            return redirect()
                ->route('dashboard.bookings')
                ->with('success', 'Booking cancelled successfully.');
                
        } catch (\LogicException $e) {
            return back()
                ->withErrors(['booking' => $e->getMessage()]);
        }
    }

    /**
     * Show booking details (for dashboard)
     */
    public function show(Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load(['activity.area', 'activity.category', 'activity.supplier', 'availability', 'payment']);

        return Inertia::render('Dashboard/Bookings/Show', [
            'booking' => $booking,
        ]);
    }

    /**
     * List user's bookings
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $bookings = $this->bookingQueries->forUser($user, $status);

        return Inertia::render('Dashboard/Bookings/Index', [
            'bookings' => $bookings,
            'currentStatus' => $status,
        ]);
    }

    /**
     * API: Calculate booking price
     */
    public function calculatePrice(Request $request, Activity $activity)
    {
        $participants = ParticipantsData::fromRequest($request);
        $totals = ($this->calculateTotal)($activity, $participants);
        
        return response()->json($totals);
    }
}
