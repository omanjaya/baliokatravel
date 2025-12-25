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
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('activity_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('booking_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->tinyInteger('rating'); // 1-5
            $table->string('title')->nullable();
            $table->text('content');
            $table->json('photos')->nullable();

            // Supplier response
            $table->text('supplier_response')->nullable();
            $table->timestamp('supplier_responded_at')->nullable();

            // Moderation
            $table->string('status')->default('published'); // pending, published, rejected, hidden
            $table->integer('helpful_count')->default(0);
            $table->integer('reported_count')->default(0);

            $table->timestamps();

            // Indexes
            $table->index('activity_id');
            $table->index('user_id');
            $table->index('rating');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
