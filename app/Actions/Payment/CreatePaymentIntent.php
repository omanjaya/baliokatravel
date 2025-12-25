<?php
// app/Actions/Payment/CreatePaymentIntent.php

namespace App\Actions\Payment;

use App\Enums\PaymentStatus;
use App\Models\Booking;
use App\Models\Payment;
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;

class CreatePaymentIntent
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe Payment Intent for a booking
     */
    public function __invoke(Booking $booking, string $currency = 'IDR'): Payment
    {
        // Convert IDR to USD if needed (Stripe doesn't support IDR directly)
        $amount = $this->calculateStripeAmount($booking->total_amount, $currency);
        $stripeCurrency = $this->getStripeCurrency($currency);

        try {
            // Create Stripe Payment Intent
            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => $amount,
                'currency' => $stripeCurrency,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'booking_id' => $booking->id,
                    'booking_reference' => $booking->reference,
                    'activity_id' => $booking->activity_id,
                    'original_currency' => $currency,
                    'original_amount' => (int) $booking->total_amount,
                ],
                'description' => "Booking {$booking->reference} for {$booking->activity->title}",
            ]);

            // Create payment record
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'stripe_payment_intent_id' => $paymentIntent->id,
                'stripe_client_secret' => $paymentIntent->client_secret,
                'amount' => $booking->total_amount,
                'currency' => $currency,
                'stripe_amount' => $amount,
                'stripe_currency' => $stripeCurrency,
                'status' => PaymentStatus::Pending,
            ]);

            return $payment;

        } catch (ApiErrorException $e) {
            throw new \RuntimeException('Failed to create payment: ' . $e->getMessage());
        }
    }

    /**
     * Calculate amount in Stripe format (cents/smallest unit)
     */
    private function calculateStripeAmount(float $amount, string $currency): int
    {
        // Stripe uses smallest currency unit (cents for USD)
        // For IDR, we convert to USD first
        if ($currency === 'IDR') {
            // Convert IDR to USD at approximately 15500 rate
            $usdRate = config('services.stripe.idr_to_usd_rate', 15500);
            $usdAmount = $amount / $usdRate;
            return (int) round($usdAmount * 100); // Convert to cents
        }

        // For USD, multiply by 100 to get cents
        return (int) round($amount * 100);
    }

    /**
     * Get the currency code Stripe should use
     */
    private function getStripeCurrency(string $currency): string
    {
        // Stripe doesn't support IDR directly, so we use USD
        if ($currency === 'IDR') {
            return 'usd';
        }
        
        return strtolower($currency);
    }
}
