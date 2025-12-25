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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('traveler')->after('email'); // traveler, supplier, admin
            $table->string('phone')->nullable()->after('role');
            $table->string('avatar')->nullable()->after('phone');

            // Supplier specific
            $table->string('business_name')->nullable();
            $table->text('business_description')->nullable();
            $table->string('business_phone')->nullable();
            $table->string('business_email')->nullable();
            $table->text('business_address')->nullable();
            $table->boolean('is_verified_supplier')->default(false);

            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 'phone', 'avatar',
                'business_name', 'business_description', 'business_phone',
                'business_email', 'business_address', 'is_verified_supplier'
            ]);
        });
    }
};
