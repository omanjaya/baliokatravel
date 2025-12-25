<?php

namespace App\Http\Controllers\Api;

use App\Actions\Booking\CalculateBookingTotal;
use App\Actions\Booking\CancelBooking;
use App\Actions\Booking\CreateBooking;
use App\DTOs\BookingData;
use App\DTOs\ParticipantsData;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Activity;
use App\Models\Booking;
use App\Queries\BookingQueries;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private CreateBooking $createBooking,
        private CancelBooking $cancelBooking,
        private CalculateBookingTotal $calculateTotal,
        private BookingQueries $bookingQueries,
    ) {}

    /**
     * List user's bookings
     */
    public function index(Request $request)
    {
        $status = $request->input('status');
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $bookings = $this->bookingQueries->forUser($user, $status);

        return BookingResource::collection($bookings);
    }

    /**
     * Create a new booking
     */
    public function store(StoreBookingRequest $request)
    {
        try {
            $data = BookingData::fromRequest($request);
            $booking = ($this->createBooking)($data);

            return response()->json([
                'data' => new BookingResource($booking->load(['activity.area', 'activity.category', 'availability'])),
                'message' => 'Booking created successfully',
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Show booking details
     */
    public function show(string $reference)
    {
        $booking = Booking::where('reference', $reference)->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        // Check if user owns this booking or is guest with matching email
        if (auth()->check()) {
            $this->authorize('view', $booking);
        }

        $booking->load(['activity.area', 'activity.category', 'activity.supplier', 'availability', 'payment']);

        return response()->json([
            'data' => new BookingResource($booking),
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, string $reference)
    {
        $booking = Booking::where('reference', $reference)->first();

        if (!$booking) {
            return response()->json([
                'message' => 'Booking not found',
            ], 404);
        }

        $this->authorize('cancel', $booking);

        try {
            $reason = $request->input('reason');
            ($this->cancelBooking)($booking, $reason, true);

            return response()->json([
                'data' => new BookingResource($booking->fresh()),
                'message' => 'Booking cancelled successfully',
            ]);

        } catch (\LogicException $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Calculate booking price
     */
    public function calculatePrice(Request $request, Activity $activity)
    {
        $participants = ParticipantsData::fromRequest($request);
        $totals = ($this->calculateTotal)($activity, $participants);

        return response()->json($totals);
    }
}
