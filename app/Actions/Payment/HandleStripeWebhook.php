<?php
// app/Actions/Payment/HandleStripeWebhook.php

namespace App\Actions\Payment;

use App\Actions\Booking\ConfirmBooking;
use App\Actions\Booking\CancelBooking;
use App\Enums\PaymentStatus;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Stripe\Event;

class HandleStripeWebhook
{
    public function __construct(
        private ConfirmBooking $confirmBooking,
        private CancelBooking $cancelBooking,
    ) {}

    public function __invoke(Event $event): void
    {
        Log::info('Stripe webhook received', ['type' => $event->type]);

        match ($event->type) {
            'payment_intent.succeeded' => $this->handlePaymentSuccess($event),
            'payment_intent.payment_failed' => $this->handlePaymentFailed($event),
            'charge.refunded' => $this->handleRefund($event),
            'charge.dispute.created' => $this->handleDispute($event),
            default => Log::info("Unhandled Stripe event: {$event->type}"),
        };
    }

    private function handlePaymentSuccess(Event $event): void
    {
        $paymentIntent = $event->data->object;
        
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
        
        if (!$payment) {
            Log::warning('Payment not found for intent', ['intent_id' => $paymentIntent->id]);
            return;
        }

        if ($payment->status !== PaymentStatus::Completed) {
            $payment->update([
                'status' => PaymentStatus::Completed,
                'paid_at' => now(),
                'stripe_charge_id' => $paymentIntent->latest_charge,
            ]);
            
            ($this->confirmBooking)($payment->booking);
            
            Log::info('Payment completed via webhook', [
                'payment_id' => $payment->id,
                'booking_reference' => $payment->booking->reference,
            ]);
        }
    }

    private function handlePaymentFailed(Event $event): void
    {
        $paymentIntent = $event->data->object;
        
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
        
        if ($payment) {
            $payment->update([
                'status' => PaymentStatus::Failed,
                'failure_reason' => $paymentIntent->last_payment_error?->message ?? 'Unknown error',
            ]);
            
            Log::info('Payment failed via webhook', [
                'payment_id' => $payment->id,
                'error' => $paymentIntent->last_payment_error?->message,
            ]);
        }
    }

    private function handleRefund(Event $event): void
    {
        $charge = $event->data->object;
        
        $payment = Payment::where('stripe_charge_id', $charge->id)->first();
        
        if ($payment) {
            $payment->update([
                'status' => PaymentStatus::Refunded,
                'refunded_at' => now(),
                'refund_amount' => $charge->amount_refunded / 100,
            ]);
            
            // Cancel the booking
            ($this->cancelBooking)($payment->booking, 'Payment refunded', false);
            
            Log::info('Payment refunded via webhook', [
                'payment_id' => $payment->id,
                'refund_amount' => $charge->amount_refunded,
            ]);
        }
    }

    private function handleDispute(Event $event): void
    {
        $dispute = $event->data->object;
        
        Log::warning('Payment dispute created', [
            'charge_id' => $dispute->charge,
            'reason' => $dispute->reason,
            'amount' => $dispute->amount,
        ]);
        
        // You may want to notify admins or take other action
    }
}
