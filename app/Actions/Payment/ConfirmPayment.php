<?php
// app/Actions/Payment/ConfirmPayment.php

namespace App\Actions\Payment;

use App\Actions\Booking\ConfirmBooking;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Stripe\StripeClient;

class ConfirmPayment
{
    private StripeClient $stripe;

    public function __construct(
        private ConfirmBooking $confirmBooking,
    ) {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Confirm a payment after successful Stripe payment
     */
    public function __invoke(string $paymentIntentId): Payment
    {
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntentId)->firstOrFail();
        
        // Verify with Stripe
        $stripeIntent = $this->stripe->paymentIntents->retrieve($paymentIntentId);
        
        if ($stripeIntent->status === 'succeeded') {
            $payment->update([
                'status' => PaymentStatus::Completed,
                'paid_at' => now(),
                'stripe_charge_id' => $stripeIntent->latest_charge,
            ]);
            
            // Confirm the booking
            ($this->confirmBooking)($payment->booking);
        }
        
        return $payment->fresh(['booking.activity']);
    }
}
