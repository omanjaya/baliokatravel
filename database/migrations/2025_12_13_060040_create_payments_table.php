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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('booking_id')->constrained()->onDelete('cascade');

            $table->decimal('amount', 12, 2);
            $table->string('currency')->default('IDR');

            $table->string('payment_method')->nullable();
            $table->string('stripe_payment_intent')->nullable();
            $table->string('stripe_payment_id')->nullable();

            $table->string('status')->default('pending'); // pending, processing, completed, failed, refunded

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->decimal('refund_amount', 12, 2)->nullable();

            $table->json('metadata')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('booking_id');
            $table->index('status');
            $table->index('stripe_payment_intent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
