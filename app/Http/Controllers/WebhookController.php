<?php

namespace App\Http\Controllers;

use App\Actions\Payment\HandleStripeWebhook;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Symfony\Component\HttpFoundation\Response;

class WebhookController extends Controller
{
    public function __construct(
        private HandleStripeWebhook $handleStripeWebhook,
    ) {}

    /**
     * Handle Stripe webhook
     */
    public function stripe(Request $request): Response
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook_secret');

        // Verify webhook signature
        if ($webhookSecret) {
            try {
                $event = Webhook::constructEvent($payload, $signature, $webhookSecret);
            } catch (SignatureVerificationException $e) {
                Log::error('Stripe webhook signature verification failed', [
                    'error' => $e->getMessage(),
                ]);
                return response('Invalid signature', 400);
            }
        } else {
            // For local development without webhook secret
            try {
                $event = \Stripe\Event::constructFrom(json_decode($payload, true));
            } catch (\Exception $e) {
                Log::error('Stripe webhook payload invalid', [
                    'error' => $e->getMessage(),
                ]);
                return response('Invalid payload', 400);
            }
        }

        try {
            ($this->handleStripeWebhook)($event);
            return response('Webhook handled', 200);
        } catch (\Exception $e) {
            Log::error('Stripe webhook handling failed', [
                'event_type' => $event->type,
                'error' => $e->getMessage(),
            ]);
            return response('Webhook handling failed', 500);
        }
    }
}
