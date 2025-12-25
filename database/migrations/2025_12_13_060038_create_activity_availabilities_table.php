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
        Schema::create('activity_availabilities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('activity_id')->constrained()->onDelete('cascade');

            $table->date('date');
            $table->time('start_time');
            $table->time('end_time')->nullable();

            $table->integer('total_spots');
            $table->integer('available_spots');

            // Price override for specific dates
            $table->decimal('price_override_idr', 12, 0)->nullable();
            $table->decimal('price_override_usd', 10, 2)->nullable();

            $table->string('status')->default('open'); // open, full, cancelled
            $table->string('note')->nullable();

            $table->timestamps();

            // Unique constraint
            $table->unique(['activity_id', 'date', 'start_time']);

            // Indexes
            $table->index('activity_id');
            $table->index('date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_availabilities');
    }
};
