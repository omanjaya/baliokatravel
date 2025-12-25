<?php

namespace App\Http\Controllers;

use App\Actions\Payment\ConfirmPayment;
use App\Actions\Payment\CreatePaymentIntent;
use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use AuthorizesRequests;
    public function __construct(
        private CreatePaymentIntent $createPaymentIntent,
        private ConfirmPayment $confirmPayment,
    ) {}

    /**
     * Create payment intent for a booking
     */
    public function createIntent(Request $request, Booking $booking): JsonResponse
    {
        $this->authorize('view', $booking);

        // Check if booking already has a payment
        if ($booking->payment && $booking->payment->status === PaymentStatus::Completed) {
            return response()->json([
                'error' => 'This booking has already been paid.',
            ], 400);
        }

        // Use existing payment if pending, otherwise create new
        $payment = $booking->payment;
        
        if (!$payment || $payment->status === PaymentStatus::Failed) {
            $payment = ($this->createPaymentIntent)($booking, $request->input('currency', 'IDR'));
        }

        return response()->json([
            'clientSecret' => $payment->stripe_client_secret,
            'paymentId' => $payment->id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
            'stripeAmount' => $payment->stripe_amount,
            'stripeCurrency' => $payment->stripe_currency,
        ]);
    }

    /**
     * Handle successful payment
     */
    public function success(Request $request, Booking $booking)
    {
        $this->authorize('view', $booking);

        $paymentIntentId = $request->query('payment_intent');
        
        if ($paymentIntentId) {
            try {
                ($this->confirmPayment)($paymentIntentId);
            } catch (\Exception $e) {
                // Webhook will handle it if this fails
            }
        }

        return redirect()->route('booking.confirmation', $booking);
    }

    /**
     * Handle payment failure
     */
    public function failed(Request $request, Booking $booking)
    {
        $this->authorize('view', $booking);

        $booking->load('activity');

        return Inertia::render('Booking/PaymentFailed', [
            'booking' => $booking,
            'error' => $request->query('error', 'Payment was not completed.'),
        ]);
    }
}
