<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');

            // Basic info
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('short_description')->nullable();

            // Location
            $table->string('area_id');
            $table->foreign('area_id')->references('id')->on('bali_areas');
            $table->string('meeting_point')->nullable();
            $table->decimal('meeting_point_lat', 10, 8)->nullable();
            $table->decimal('meeting_point_lng', 11, 8)->nullable();
            $table->text('meeting_point_instructions')->nullable();

            // Category
            $table->string('category_id');
            $table->foreign('category_id')->references('id')->on('categories');

            // Details
            $table->integer('duration_minutes');
            $table->integer('min_group_size')->default(1);
            $table->integer('max_group_size');
            $table->integer('min_age')->nullable();

            // Pricing (IDR primary)
            $table->decimal('price_idr', 12, 0);
            $table->decimal('price_usd', 10, 2)->nullable();
            $table->decimal('child_price_idr', 12, 0)->nullable();
            $table->decimal('child_price_usd', 10, 2)->nullable();

            // Media
            $table->string('cover_image')->nullable();
            $table->json('images')->nullable();
            $table->string('video_url')->nullable();

            // Content arrays
            $table->json('highlights')->nullable();
            $table->json('included')->nullable();
            $table->json('excluded')->nullable();
            $table->json('requirements')->nullable();
            $table->json('what_to_bring')->nullable();

            // Settings
            $table->json('languages')->default('["en", "id"]');
            $table->string('difficulty')->default('easy'); // easy, moderate, challenging
            $table->string('cancellation_policy')->default('flexible'); // flexible, moderate, strict
            $table->boolean('instant_booking')->default(true);

            // Stats
            $table->decimal('rating_average', 2, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('booking_count')->default(0);

            // Status
            $table->string('status')->default('draft'); // draft, pending, published, rejected, archived
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_featured')->default(false);

            // Timestamps
            $table->timestamps();
            $table->timestamp('published_at')->nullable();
            $table->softDeletes();

            // Indexes
            $table->index('supplier_id');
            $table->index('area_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('rating_average');
            $table->index('price_idr');
            $table->index('is_featured');
        });

        // Full-text search index (PostgreSQL)
        DB::statement('CREATE INDEX activities_search_idx ON activities USING GIN (to_tsvector(\'english\', coalesce(title, \'\') || \' \' || coalesce(description, \'\')))');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
