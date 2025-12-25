<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Rename columns for clarity
            $table->renameColumn('stripe_payment_intent', 'stripe_payment_intent_id');
            $table->renameColumn('stripe_payment_id', 'stripe_charge_id');
            
            // Add new Stripe fields
            $table->string('stripe_client_secret')->nullable()->after('stripe_payment_intent');
            $table->string('stripe_refund_id')->nullable()->after('stripe_payment_id');
            
            // Stripe amount in cents/smallest unit
            $table->integer('stripe_amount')->nullable()->after('currency');
            $table->string('stripe_currency', 10)->nullable()->after('stripe_amount');
            
            // Failure tracking
            $table->text('failure_reason')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'stripe_client_secret',
                'stripe_refund_id',
                'stripe_amount',
                'stripe_currency',
                'failure_reason',
            ]);
            
            $table->renameColumn('stripe_payment_intent_id', 'stripe_payment_intent');
            $table->renameColumn('stripe_charge_id', 'stripe_payment_id');
        });
    }
};
