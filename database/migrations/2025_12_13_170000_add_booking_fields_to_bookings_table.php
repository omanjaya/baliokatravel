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
        Schema::table('bookings', function (Blueprint $table) {
            // Add service fee column after subtotal
            $table->decimal('service_fee', 12, 2)->default(0)->after('subtotal');
            
            // Add booking date/time for quick access
            $table->date('booking_date')->nullable()->after('special_requests');
            $table->time('booking_time')->nullable()->after('booking_date');
            
            // Track who cancelled
            $table->boolean('cancelled_by_customer')->default(true)->after('cancellation_reason');
            
            // Make unit_price nullable (not always needed)
            $table->decimal('unit_price', 12, 2)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn([
                'service_fee',
                'booking_date',
                'booking_time',
                'cancelled_by_customer',
            ]);
        });
    }
};
