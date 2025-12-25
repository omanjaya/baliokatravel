<?php
// app/Actions/Payment/ProcessRefund.php

namespace App\Actions\Payment;

use App\Enums\PaymentStatus;
use App\Models\Payment;
use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;

class ProcessRefund
{
    private StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Process a refund for a payment
     */
    public function __invoke(Payment $payment, ?int $amount = null): Payment
    {
        if ($payment->status !== PaymentStatus::Completed) {
            throw new \LogicException('Only completed payments can be refunded.');
        }

        if (!$payment->stripe_payment_intent_id) {
            throw new \LogicException('No Stripe payment intent found.');
        }

        try {
            $refundParams = [
                'payment_intent' => $payment->stripe_payment_intent_id,
            ];

            // Partial refund if amount specified
            if ($amount !== null) {
                $refundParams['amount'] = $this->convertToStripeCents($amount, $payment->currency);
            }

            $refund = $this->stripe->refunds->create($refundParams);

            $payment->update([
                'status' => $amount === null || $amount >= $payment->amount 
                    ? PaymentStatus::Refunded 
                    : PaymentStatus::Completed, // Partial refund keeps completed
                'refunded_at' => now(),
                'refund_amount' => ($payment->refund_amount ?? 0) + ($amount ?? $payment->amount),
                'stripe_refund_id' => $refund->id,
            ]);

            return $payment->fresh();

        } catch (ApiErrorException $e) {
            throw new \RuntimeException('Refund failed: ' . $e->getMessage());
        }
    }

    private function convertToStripeCents(int $amount, string $currency): int
    {
        if ($currency === 'IDR') {
            $usdRate = config('services.stripe.idr_to_usd_rate', 15500);
            $usdAmount = $amount / $usdRate;
            return (int) round($usdAmount * 100);
        }
        
        return $amount * 100;
    }
}
