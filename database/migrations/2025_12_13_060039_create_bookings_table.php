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
        Schema::create('bookings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('reference')->unique(); // BOT-2025-XXXXXX

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('activity_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('availability_id')->constrained('activity_availabilities')->onDelete('cascade');

            // Status
            $table->string('status')->default('pending'); // pending, confirmed, cancelled, completed, refunded, no_show

            // Participants
            $table->json('participants'); // { adults: 2, children: 1 }
            $table->json('participant_details')->nullable(); // [{ name: "John", age: 30 }]
            $table->integer('total_participants');

            // Contact
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('contact_phone')->nullable();
            $table->text('special_requests')->nullable();

            // Pricing
            $table->string('currency')->default('IDR');
            $table->decimal('unit_price', 12, 2);
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->string('promo_code')->nullable();

            // Timestamps
            $table->timestamps();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->text('cancellation_reason')->nullable();

            // Supplier notes
            $table->text('supplier_notes')->nullable();

            // Indexes
            $table->index('user_id');
            $table->index('activity_id');
            $table->index('status');
            $table->index('reference');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
