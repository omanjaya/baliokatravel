<?php

namespace App\Http\Controllers\Api;

use App\Actions\Payment\ConfirmPayment;
use App\Actions\Payment\CreatePaymentIntent;
use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\PaymentResource;
use App\Models\Booking;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private CreatePaymentIntent $createPaymentIntent,
        private ConfirmPayment $confirmPayment,
    ) {}

    /**
     * Create payment intent for Stripe
     */
    public function createIntent(string $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        if (auth()->check()) {
            $this->authorize('view', $booking);
        }

        try {
            $paymentIntent = ($this->createPaymentIntent)($booking);

            return response()->json([
                'data' => [
                    'client_secret' => $paymentIntent->client_secret,
                    'amount' => $booking->total_amount,
                    'currency' => strtolower($booking->currency),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create payment intent',
            ], 500);
        }
    }

    /**
     * Confirm payment after Stripe payment
     */
    public function confirmPayment(Request $request, string $bookingId)
    {
        $booking = Booking::findOrFail($bookingId);

        if (auth()->check()) {
            $this->authorize('view', $booking);
        }

        $paymentIntentId = $request->input('payment_intent_id');

        try {
            $payment = ($this->confirmPayment)($booking, $paymentIntentId);

            return response()->json([
                'data' => new PaymentResource($payment),
                'booking' => new BookingResource($booking->fresh(['activity', 'availability', 'payment'])),
                'message' => 'Payment confirmed successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Payment confirmation failed: ' . $e->getMessage(),
            ], 422);
        }
    }
}
