# 🗄️ Database - BaliokaTravel

## Laravel Migrations & Eloquent Models

---

## Database: PostgreSQL

```bash
# Create database
sudo -u postgres createdb baliokatravel

# Or via psql
psql -U postgres
CREATE DATABASE baliokatravel;
```

---

## Migrations

### 1. Bali Areas

```php
<?php
// database/migrations/2024_01_01_000001_create_bali_areas_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bali_areas', function (Blueprint $table) {
            $table->string('id')->primary(); // ubud, seminyak, etc
            $table->string('name');
            $table->string('name_id')->nullable(); // Indonesian name
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->json('popular_for')->nullable(); // ['surfing', 'temples']
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bali_areas');
    }
};
```

### 2. Categories

```php
<?php
// database/migrations/2024_01_01_000002_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->string('id')->primary(); // water_sports, adventure, etc
            $table->string('name');
            $table->string('name_id')->nullable();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

### 3. Activities

```php
<?php
// database/migrations/2024_01_01_000003_create_activities_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('activities');
    }
};
```

### 4. Activity Availabilities

```php
<?php
// database/migrations/2024_01_01_000004_create_activity_availabilities_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('activity_availabilities');
    }
};
```

### 5. Bookings

```php
<?php
// database/migrations/2024_01_01_000005_create_bookings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
```

### 6. Payments

```php
<?php
// database/migrations/2024_01_01_000006_create_payments_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
```

### 7. Reviews

```php
<?php
// database/migrations/2024_01_01_000007_create_reviews_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
```

### 8. Add Role to Users

```php
<?php
// database/migrations/2024_01_01_000008_add_role_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
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
```

---

## Eloquent Models

### User Model

```php
<?php
// app/Models/User.php

namespace App\Models;

use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar',
        'business_name',
        'business_description',
        'business_phone',
        'business_email',
        'business_address',
        'is_verified_supplier',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
            'is_verified_supplier' => 'boolean',
        ];
    }

    // Relationships
    public function activities()
    {
        return $this->hasMany(Activity::class, 'supplier_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Helpers
    public function isAdmin(): bool
    {
        return $this->role === UserRole::Admin;
    }

    public function isSupplier(): bool
    {
        return $this->role === UserRole::Supplier;
    }

    public function isTraveler(): bool
    {
        return $this->role === UserRole::Traveler;
    }

    // Filament
    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'admin') {
            return $this->isAdmin();
        }
        
        if ($panel->getId() === 'supplier') {
            return $this->isSupplier();
        }
        
        return false;
    }
}
```

### Activity Model

```php
<?php
// app/Models/Activity.php

namespace App\Models;

use App\Enums\ActivityStatus;
use App\Enums\Difficulty;
use App\Enums\CancellationPolicy;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Activity extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'supplier_id',
        'title',
        'slug',
        'description',
        'short_description',
        'area_id',
        'category_id',
        'meeting_point',
        'meeting_point_lat',
        'meeting_point_lng',
        'meeting_point_instructions',
        'duration_minutes',
        'min_group_size',
        'max_group_size',
        'min_age',
        'price_idr',
        'price_usd',
        'child_price_idr',
        'child_price_usd',
        'cover_image',
        'images',
        'video_url',
        'highlights',
        'included',
        'excluded',
        'requirements',
        'what_to_bring',
        'languages',
        'difficulty',
        'cancellation_policy',
        'instant_booking',
        'status',
        'rejection_reason',
        'is_featured',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'highlights' => 'array',
            'included' => 'array',
            'excluded' => 'array',
            'requirements' => 'array',
            'what_to_bring' => 'array',
            'languages' => 'array',
            'instant_booking' => 'boolean',
            'is_featured' => 'boolean',
            'price_idr' => 'decimal:0',
            'price_usd' => 'decimal:2',
            'rating_average' => 'decimal:1',
            'status' => ActivityStatus::class,
            'difficulty' => Difficulty::class,
            'cancellation_policy' => CancellationPolicy::class,
            'published_at' => 'datetime',
        ];
    }

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($activity) {
            if (!$activity->slug) {
                $activity->slug = Str::slug($activity->title);
            }
        });
    }

    // Relationships
    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function area()
    {
        return $this->belongsTo(BaliArea::class, 'area_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function availabilities()
    {
        return $this->hasMany(ActivityAvailability::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', ActivityStatus::Published);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInArea($query, string $areaId)
    {
        return $query->where('area_id', $areaId);
    }

    public function scopeInCategory($query, string $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Helpers
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price_idr, 0, ',', '.');
    }

    public function getFormattedDurationAttribute(): string
    {
        $hours = floor($this->duration_minutes / 60);
        $minutes = $this->duration_minutes % 60;
        
        if ($hours && $minutes) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours) {
            return "{$hours}h";
        }
        return "{$minutes}m";
    }

    public function updateRating(): void
    {
        $this->rating_average = $this->reviews()->avg('rating') ?? 0;
        $this->review_count = $this->reviews()->count();
        $this->save();
    }
}
```

### Booking Model

```php
<?php
// app/Models/Booking.php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'reference',
        'user_id',
        'activity_id',
        'availability_id',
        'status',
        'participants',
        'participant_details',
        'total_participants',
        'contact_name',
        'contact_email',
        'contact_phone',
        'special_requests',
        'currency',
        'unit_price',
        'subtotal',
        'discount_amount',
        'tax_amount',
        'total_amount',
        'promo_code',
        'confirmed_at',
        'cancelled_at',
        'completed_at',
        'cancellation_reason',
        'supplier_notes',
    ];

    protected function casts(): array
    {
        return [
            'participants' => 'array',
            'participant_details' => 'array',
            'status' => BookingStatus::class,
            'unit_price' => 'decimal:2',
            'subtotal' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'tax_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'confirmed_at' => 'datetime',
            'cancelled_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    // Auto-generate reference
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($booking) {
            if (!$booking->reference) {
                $booking->reference = self::generateReference();
            }
        });
    }

    public static function generateReference(): string
    {
        $prefix = config('baliokatravel.booking.prefix', 'BOT');
        $year = date('Y');
        $random = strtoupper(Str::random(6));
        
        return "{$prefix}-{$year}-{$random}";
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activity()
    {
        return $this->belongsTo(Activity::class);
    }

    public function availability()
    {
        return $this->belongsTo(ActivityAvailability::class, 'availability_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // Helpers
    public function isPending(): bool
    {
        return $this->status === BookingStatus::Pending;
    }

    public function isConfirmed(): bool
    {
        return $this->status === BookingStatus::Confirmed;
    }

    public function canCancel(): bool
    {
        return in_array($this->status, [BookingStatus::Pending, BookingStatus::Confirmed]);
    }

    public function canReview(): bool
    {
        return $this->status === BookingStatus::Completed && !$this->review;
    }
}
```

---

## Enums

```php
<?php
// app/Enums/UserRole.php
namespace App\Enums;

enum UserRole: string
{
    case Traveler = 'traveler';
    case Supplier = 'supplier';
    case Admin = 'admin';
}

// app/Enums/ActivityStatus.php
namespace App\Enums;

enum ActivityStatus: string
{
    case Draft = 'draft';
    case Pending = 'pending';
    case Published = 'published';
    case Rejected = 'rejected';
    case Archived = 'archived';
}

// app/Enums/BookingStatus.php
namespace App\Enums;

enum BookingStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';
    case Completed = 'completed';
    case Refunded = 'refunded';
    case NoShow = 'no_show';
}

// app/Enums/Difficulty.php
namespace App\Enums;

enum Difficulty: string
{
    case Easy = 'easy';
    case Moderate = 'moderate';
    case Challenging = 'challenging';
}
```

---

## Seeders

### BaliAreaSeeder

```php
<?php
// database/seeders/BaliAreaSeeder.php

namespace Database\Seeders;

use App\Models\BaliArea;
use Illuminate\Database\Seeder;

class BaliAreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            ['id' => 'ubud', 'name' => 'Ubud', 'popular_for' => ['culture', 'rice_terraces', 'yoga', 'art']],
            ['id' => 'seminyak', 'name' => 'Seminyak', 'popular_for' => ['beach_clubs', 'shopping', 'restaurants']],
            ['id' => 'kuta', 'name' => 'Kuta', 'popular_for' => ['surfing', 'beach', 'nightlife']],
            ['id' => 'canggu', 'name' => 'Canggu', 'popular_for' => ['surfing', 'cafes', 'digital_nomads']],
            ['id' => 'nusa_dua', 'name' => 'Nusa Dua', 'popular_for' => ['luxury', 'water_sports', 'resorts']],
            ['id' => 'sanur', 'name' => 'Sanur', 'popular_for' => ['calm_beach', 'sunrise', 'family']],
            ['id' => 'uluwatu', 'name' => 'Uluwatu', 'popular_for' => ['temples', 'surfing', 'cliffs']],
            ['id' => 'jimbaran', 'name' => 'Jimbaran', 'popular_for' => ['seafood', 'sunset', 'beach']],
            ['id' => 'kintamani', 'name' => 'Kintamani', 'popular_for' => ['volcano', 'trekking', 'sunrise']],
            ['id' => 'nusa_penida', 'name' => 'Nusa Penida', 'popular_for' => ['snorkeling', 'island', 'photography']],
            ['id' => 'nusa_lembongan', 'name' => 'Nusa Lembongan', 'popular_for' => ['diving', 'mangroves']],
            ['id' => 'amed', 'name' => 'Amed', 'popular_for' => ['diving', 'snorkeling', 'quiet']],
            ['id' => 'lovina', 'name' => 'Lovina', 'popular_for' => ['dolphins', 'north_bali', 'waterfalls']],
        ];

        foreach ($areas as $area) {
            BaliArea::updateOrCreate(
                ['id' => $area['id']],
                $area
            );
        }
    }
}
```

### CategorySeeder

```php
<?php
// database/seeders/CategorySeeder.php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 'water_sports', 'name' => 'Water Sports', 'icon' => 'waves', 'display_order' => 1],
            ['id' => 'adventure', 'name' => 'Adventure', 'icon' => 'mountain', 'display_order' => 2],
            ['id' => 'culture', 'name' => 'Culture & Temples', 'icon' => 'landmark', 'display_order' => 3],
            ['id' => 'food', 'name' => 'Food & Cooking', 'icon' => 'utensils', 'display_order' => 4],
            ['id' => 'wellness', 'name' => 'Wellness & Spa', 'icon' => 'heart', 'display_order' => 5],
            ['id' => 'tours', 'name' => 'Tours & Sightseeing', 'icon' => 'map', 'display_order' => 6],
            ['id' => 'island_hopping', 'name' => 'Island Hopping', 'icon' => 'ship', 'display_order' => 7],
            ['id' => 'sunset', 'name' => 'Sunset Activities', 'icon' => 'sunset', 'display_order' => 8],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['id' => $category['id']],
                $category
            );
        }
    }
}
```

---

## Run Migrations

```bash
# Fresh migration with seeders
php artisan migrate:fresh --seed

# Or step by step
php artisan migrate
php artisan db:seed --class=BaliAreaSeeder
php artisan db:seed --class=CategorySeeder
```
