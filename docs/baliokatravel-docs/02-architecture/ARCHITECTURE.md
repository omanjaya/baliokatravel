# 🏗️ Architecture Guide - BaliokaTravel

## Laravel 11 + Octane + Inertia + React (Anti-Refactor)

---

## Design Principles

### 1. **Actions Pattern** - Single Responsibility
```
❌ BookingService dengan 20 methods
✅ CreateBooking, ConfirmBooking, CancelBooking (masing-masing 1 file)
```

### 2. **DTOs** - Type-Safe Data Transfer
```
❌ Array $data yang tidak jelas isinya
✅ BookingData DTO dengan typed properties
```

### 3. **Lean Models** - Hanya Relationships & Scopes Sederhana
```
❌ Business logic di Model
✅ Business logic di Actions, Model hanya data layer
```

### 4. **Queries Class** - Reusable Complex Queries
```
❌ Query panjang di Controller
✅ ActivityQueries::search($filters) yang reusable
```

---

## Complete Folder Structure

```
baliokatravel/
├── app/
│   ├── Actions/                        # ⭐ Business logic (single purpose)
│   │   ├── Activity/
│   │   │   ├── CreateActivity.php
│   │   │   ├── UpdateActivity.php
│   │   │   ├── PublishActivity.php
│   │   │   ├── RejectActivity.php
│   │   │   └── CalculateActivityPrice.php
│   │   ├── Booking/
│   │   │   ├── CreateBooking.php
│   │   │   ├── ConfirmBooking.php
│   │   │   ├── CancelBooking.php
│   │   │   ├── CompleteBooking.php
│   │   │   └── CalculateBookingTotal.php
│   │   ├── Payment/
│   │   │   ├── CreatePaymentIntent.php
│   │   │   ├── ConfirmPayment.php
│   │   │   ├── ProcessRefund.php
│   │   │   └── HandleStripeWebhook.php
│   │   ├── Review/
│   │   │   ├── CreateReview.php
│   │   │   └── UpdateActivityRating.php
│   │   └── User/
│   │       ├── CreateSupplier.php
│   │       └── UpdateProfile.php
│   │
│   ├── DTOs/                           # ⭐ Type-safe data objects
│   │   ├── ActivityData.php
│   │   ├── BookingData.php
│   │   ├── PaymentData.php
│   │   ├── ReviewData.php
│   │   ├── SearchFiltersData.php
│   │   └── ParticipantsData.php
│   │
│   ├── Enums/                          # Status & type constants
│   │   ├── UserRole.php
│   │   ├── ActivityStatus.php
│   │   ├── BookingStatus.php
│   │   ├── PaymentStatus.php
│   │   ├── Difficulty.php
│   │   └── CancellationPolicy.php
│   │
│   ├── Events/                         # Domain events
│   │   ├── Booking/
│   │   │   ├── BookingCreated.php
│   │   │   ├── BookingConfirmed.php
│   │   │   ├── BookingCancelled.php
│   │   │   └── BookingCompleted.php
│   │   └── Payment/
│   │       ├── PaymentReceived.php
│   │       └── RefundProcessed.php
│   │
│   ├── Filament/
│   │   ├── Admin/                      # Admin panel (/admin)
│   │   │   ├── Resources/
│   │   │   │   ├── ActivityResource/
│   │   │   │   ├── BookingResource/
│   │   │   │   ├── UserResource/
│   │   │   │   └── ...
│   │   │   ├── Widgets/
│   │   │   │   ├── StatsOverview.php
│   │   │   │   ├── LatestBookings.php
│   │   │   │   └── RevenueChart.php
│   │   │   └── Pages/
│   │   └── Supplier/                   # Supplier panel (/supplier)
│   │       ├── Resources/
│   │       │   ├── ActivityResource/
│   │       │   ├── BookingResource/
│   │       │   └── AvailabilityResource/
│   │       ├── Widgets/
│   │       └── Pages/
│   │
│   ├── Http/
│   │   ├── Controllers/                # Thin controllers (routing only)
│   │   │   ├── HomeController.php
│   │   │   ├── ActivityController.php
│   │   │   ├── AreaController.php
│   │   │   ├── BookingController.php
│   │   │   ├── PaymentController.php
│   │   │   ├── ReviewController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ProfileController.php
│   │   │   └── WebhookController.php
│   │   ├── Middleware/
│   │   │   ├── EnsureUserIsSupplier.php
│   │   │   └── EnsureUserIsAdmin.php
│   │   └── Requests/                   # Form validation
│   │       ├── Booking/
│   │       │   ├── StoreBookingRequest.php
│   │       │   └── CancelBookingRequest.php
│   │       └── Review/
│   │           └── StoreReviewRequest.php
│   │
│   ├── Listeners/                      # Event handlers
│   │   ├── Booking/
│   │   │   ├── SendBookingConfirmation.php
│   │   │   ├── NotifySupplierNewBooking.php
│   │   │   └── ScheduleBookingReminder.php
│   │   └── Payment/
│   │       ├── ConfirmBookingOnPayment.php
│   │       └── SendPaymentReceipt.php
│   │
│   ├── Mail/                           # Email templates
│   │   ├── BookingConfirmed.php
│   │   ├── BookingCancelled.php
│   │   ├── BookingReminder.php
│   │   └── PaymentReceipt.php
│   │
│   ├── Models/                         # Lean Eloquent models
│   │   ├── User.php
│   │   ├── Activity.php
│   │   ├── ActivityAvailability.php
│   │   ├── BaliArea.php
│   │   ├── Booking.php
│   │   ├── Category.php
│   │   ├── Payment.php
│   │   └── Review.php
│   │
│   ├── Policies/                       # Authorization
│   │   ├── ActivityPolicy.php
│   │   ├── BookingPolicy.php
│   │   └── ReviewPolicy.php
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   ├── EventServiceProvider.php
│   │   └── Filament/
│   │       ├── AdminPanelProvider.php
│   │       └── SupplierPanelProvider.php
│   │
│   ├── Queries/                        # ⭐ Complex reusable queries
│   │   ├── ActivityQueries.php
│   │   ├── BookingQueries.php
│   │   └── SearchQueries.php
│   │
│   └── Support/                        # Helpers & utilities
│       ├── Helpers/
│       │   ├── PriceHelper.php
│       │   ├── BookingReferenceGenerator.php
│       │   └── CurrencyConverter.php
│       └── Traits/
│           ├── HasUuid.php
│           ├── HasBookingReference.php
│           └── HasSlug.php
│
├── config/
│   ├── octane.php
│   └── baliokatravel.php               # Custom app config
│
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
│
├── resources/
│   ├── js/
│   │   ├── Components/
│   │   │   ├── common/                 # Reusable everywhere
│   │   │   │   ├── Logo.tsx
│   │   │   │   ├── Rating.tsx
│   │   │   │   ├── PriceDisplay.tsx
│   │   │   │   └── LoadingSpinner.tsx
│   │   │   ├── activity/               # Activity-specific
│   │   │   │   ├── ActivityCard.tsx
│   │   │   │   ├── ActivityGallery.tsx
│   │   │   │   └── ActivityInfo.tsx
│   │   │   ├── booking/                # Booking flow
│   │   │   │   ├── BookingWidget.tsx
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   ├── ParticipantSelector.tsx
│   │   │   │   └── PriceSummary.tsx
│   │   │   ├── search/                 # Search & filters
│   │   │   │   ├── SearchBox.tsx
│   │   │   │   ├── FilterSidebar.tsx
│   │   │   │   └── ResultsGrid.tsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   └── ui/                     # shadcn/ui
│   │   │       └── ...
│   │   │
│   │   ├── Layouts/
│   │   │   ├── GuestLayout.tsx
│   │   │   ├── AuthLayout.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   ├── Pages/                      # Inertia pages
│   │   │   ├── Home.tsx
│   │   │   ├── Search.tsx
│   │   │   ├── Activities/Show.tsx
│   │   │   ├── Booking/
│   │   │   │   ├── Create.tsx
│   │   │   │   ├── Payment.tsx
│   │   │   │   └── Confirmation.tsx
│   │   │   └── Dashboard/
│   │   │       ├── Index.tsx
│   │   │       └── Bookings/
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useBooking.ts
│   │   │   └── useSearch.ts
│   │   │
│   │   ├── stores/                     # Zustand
│   │   │   ├── searchStore.ts
│   │   │   └── bookingStore.ts
│   │   │
│   │   ├── lib/utils.ts
│   │   └── types/index.d.ts
│   │
│   └── views/
│       └── app.blade.php
│
├── routes/
│   ├── web.php
│   └── auth.php
│
└── tests/
    ├── Feature/
    │   ├── Actions/
    │   └── Http/
    └── Unit/
        └── DTOs/
```

---

## Actions Pattern Examples

### Create Booking Action

```php
<?php
// app/Actions/Booking/CreateBooking.php

namespace App\Actions\Booking;

use App\DTOs\BookingData;
use App\Events\Booking\BookingCreated;
use App\Models\Booking;
use App\Models\Activity;
use App\Models\ActivityAvailability;
use App\Support\Helpers\BookingReferenceGenerator;
use Illuminate\Support\Facades\DB;

class CreateBooking
{
    public function __construct(
        private CalculateBookingTotal $calculateTotal,
        private BookingReferenceGenerator $referenceGenerator,
    ) {}

    public function __invoke(BookingData $data): Booking
    {
        return DB::transaction(function () use ($data) {
            $activity = Activity::findOrFail($data->activityId);
            $availability = ActivityAvailability::findOrFail($data->availabilityId);
            
            // Validate availability
            $this->validateAvailability($availability, $data->totalParticipants());
            
            // Calculate total
            $totals = ($this->calculateTotal)($activity, $data->participants);
            
            // Create booking
            $booking = Booking::create([
                'reference' => $this->referenceGenerator->generate(),
                'user_id' => auth()->id(),
                'activity_id' => $data->activityId,
                'availability_id' => $data->availabilityId,
                'contact_name' => $data->contactName,
                'contact_email' => $data->contactEmail,
                'contact_phone' => $data->contactPhone,
                'participants' => $data->participants->toArray(),
                'total_participants' => $data->totalParticipants(),
                'subtotal' => $totals['subtotal'],
                'service_fee' => $totals['service_fee'],
                'total_amount' => $totals['total'],
                'currency' => 'IDR',
                'special_requests' => $data->specialRequests,
                'status' => 'pending',
            ]);
            
            // Update availability
            $availability->decrement('available_spots', $data->totalParticipants());
            
            // Dispatch event
            BookingCreated::dispatch($booking);
            
            return $booking;
        });
    }
    
    private function validateAvailability(ActivityAvailability $availability, int $participants): void
    {
        if ($availability->status !== 'open') {
            throw new \Exception('This time slot is no longer available.');
        }
        
        if ($availability->available_spots < $participants) {
            throw new \Exception('Not enough spots available.');
        }
    }
}
```

### Calculate Booking Total Action

```php
<?php
// app/Actions/Booking/CalculateBookingTotal.php

namespace App\Actions\Booking;

use App\DTOs\ParticipantsData;
use App\Models\Activity;

class CalculateBookingTotal
{
    private const SERVICE_FEE_PERCENT = 0.05; // 5%
    
    public function __invoke(Activity $activity, ParticipantsData $participants): array
    {
        $adultTotal = $participants->adults * $activity->price_idr;
        $childTotal = $participants->children * ($activity->child_price_idr ?? $activity->price_idr * 0.7);
        
        $subtotal = $adultTotal + $childTotal;
        $serviceFee = (int) round($subtotal * self::SERVICE_FEE_PERCENT);
        $total = $subtotal + $serviceFee;
        
        return [
            'adult_price' => $activity->price_idr,
            'child_price' => $activity->child_price_idr ?? (int) ($activity->price_idr * 0.7),
            'adult_total' => $adultTotal,
            'child_total' => $childTotal,
            'subtotal' => $subtotal,
            'service_fee' => $serviceFee,
            'total' => $total,
        ];
    }
}
```

### Handle Stripe Webhook Action

```php
<?php
// app/Actions/Payment/HandleStripeWebhook.php

namespace App\Actions\Payment;

use App\Actions\Booking\ConfirmBooking;
use App\Models\Payment;
use App\Enums\PaymentStatus;
use Stripe\Event;

class HandleStripeWebhook
{
    public function __construct(
        private ConfirmBooking $confirmBooking,
        private ProcessRefund $processRefund,
    ) {}

    public function __invoke(Event $event): void
    {
        match ($event->type) {
            'payment_intent.succeeded' => $this->handlePaymentSuccess($event),
            'payment_intent.payment_failed' => $this->handlePaymentFailed($event),
            'charge.refunded' => $this->handleRefund($event),
            default => null,
        };
    }
    
    private function handlePaymentSuccess(Event $event): void
    {
        $paymentIntent = $event->data->object;
        
        $payment = Payment::where('stripe_payment_intent_id', $paymentIntent->id)->first();
        
        if ($payment) {
            $payment->update([
                'status' => PaymentStatus::Completed,
                'paid_at' => now(),
            ]);
            
            ($this->confirmBooking)($payment->booking);
        }
    }
    
    private function handlePaymentFailed(Event $event): void
    {
        $paymentIntent = $event->data->object;
        
        Payment::where('stripe_payment_intent_id', $paymentIntent->id)
            ->update(['status' => PaymentStatus::Failed]);
    }
    
    private function handleRefund(Event $event): void
    {
        $charge = $event->data->object;
        ($this->processRefund)($charge->payment_intent, $charge->amount_refunded);
    }
}
```

---

## DTO Examples

### Booking Data DTO

```php
<?php
// app/DTOs/BookingData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class BookingData
{
    public function __construct(
        public string $activityId,
        public string $availabilityId,
        public ParticipantsData $participants,
        public string $contactName,
        public string $contactEmail,
        public string $contactPhone,
        public ?string $specialRequests = null,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            activityId: $request->input('activity_id'),
            availabilityId: $request->input('availability_id'),
            participants: ParticipantsData::fromRequest($request),
            contactName: $request->input('contact_name'),
            contactEmail: $request->input('contact_email'),
            contactPhone: $request->input('contact_phone'),
            specialRequests: $request->input('special_requests'),
        );
    }

    public function totalParticipants(): int
    {
        return $this->participants->total();
    }
}
```

### Participants Data DTO

```php
<?php
// app/DTOs/ParticipantsData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class ParticipantsData
{
    public function __construct(
        public int $adults,
        public int $children = 0,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            adults: (int) $request->input('adults', 1),
            children: (int) $request->input('children', 0),
        );
    }

    public function total(): int
    {
        return $this->adults + $this->children;
    }

    public function toArray(): array
    {
        return [
            'adults' => $this->adults,
            'children' => $this->children,
        ];
    }
}
```

### Search Filters DTO

```php
<?php
// app/DTOs/SearchFiltersData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class SearchFiltersData
{
    public function __construct(
        public ?string $keyword = null,
        public ?string $area = null,
        public ?string $category = null,
        public ?string $date = null,
        public ?int $guests = null,
        public ?int $minPrice = null,
        public ?int $maxPrice = null,
        public ?float $minRating = null,
        public string $sortBy = 'popular',
        public int $perPage = 12,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            keyword: $request->input('q'),
            area: $request->input('area'),
            category: $request->input('category'),
            date: $request->input('date'),
            guests: $request->input('guests') ? (int) $request->input('guests') : null,
            minPrice: $request->input('min_price') ? (int) $request->input('min_price') : null,
            maxPrice: $request->input('max_price') ? (int) $request->input('max_price') : null,
            minRating: $request->input('min_rating') ? (float) $request->input('min_rating') : null,
            sortBy: $request->input('sort', 'popular'),
            perPage: (int) $request->input('per_page', 12),
        );
    }
}
```

---

## Queries Class Example

```php
<?php
// app/Queries/ActivityQueries.php

namespace App\Queries;

use App\DTOs\SearchFiltersData;
use App\Enums\ActivityStatus;
use App\Models\Activity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ActivityQueries
{
    public function search(SearchFiltersData $filters): LengthAwarePaginator
    {
        return Activity::query()
            ->with(['area', 'category', 'supplier:id,name'])
            ->where('status', ActivityStatus::Published)
            ->when($filters->keyword, fn (Builder $q) => 
                $q->whereRaw("search_vector @@ plainto_tsquery('english', ?)", [$filters->keyword])
            )
            ->when($filters->area, fn (Builder $q) => 
                $q->whereHas('area', fn ($q) => $q->where('slug', $filters->area))
            )
            ->when($filters->category, fn (Builder $q) => 
                $q->whereHas('category', fn ($q) => $q->where('slug', $filters->category))
            )
            ->when($filters->date, fn (Builder $q) => 
                $q->whereHas('availabilities', fn ($q) => 
                    $q->where('date', $filters->date)
                      ->where('status', 'open')
                      ->where('available_spots', '>=', $filters->guests ?? 1)
                )
            )
            ->when($filters->minPrice, fn (Builder $q) => 
                $q->where('price_idr', '>=', $filters->minPrice)
            )
            ->when($filters->maxPrice, fn (Builder $q) => 
                $q->where('price_idr', '<=', $filters->maxPrice)
            )
            ->when($filters->minRating, fn (Builder $q) => 
                $q->where('rating_average', '>=', $filters->minRating)
            )
            ->orderBy(...$this->getSortColumns($filters->sortBy))
            ->paginate($filters->perPage);
    }

    public function featured(int $limit = 8): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::query()
            ->with(['area', 'category'])
            ->where('status', ActivityStatus::Published)
            ->where('is_featured', true)
            ->orderBy('rating_average', 'desc')
            ->limit($limit)
            ->get();
    }

    public function byArea(string $areaSlug, int $limit = 12): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::query()
            ->with(['area', 'category'])
            ->where('status', ActivityStatus::Published)
            ->whereHas('area', fn ($q) => $q->where('slug', $areaSlug))
            ->orderBy('rating_average', 'desc')
            ->limit($limit)
            ->get();
    }

    public function similar(Activity $activity, int $limit = 4): \Illuminate\Database\Eloquent\Collection
    {
        return Activity::query()
            ->with(['area', 'category'])
            ->where('status', ActivityStatus::Published)
            ->where('id', '!=', $activity->id)
            ->where(fn ($q) => 
                $q->where('area_id', $activity->area_id)
                  ->orWhere('category_id', $activity->category_id)
            )
            ->orderBy('rating_average', 'desc')
            ->limit($limit)
            ->get();
    }

    private function getSortColumns(string $sortBy): array
    {
        return match ($sortBy) {
            'price_low' => ['price_idr', 'asc'],
            'price_high' => ['price_idr', 'desc'],
            'rating' => ['rating_average', 'desc'],
            'newest' => ['created_at', 'desc'],
            default => ['booking_count', 'desc'], // popular
        };
    }
}
```

---

## Thin Controller Example

```php
<?php
// app/Http/Controllers/BookingController.php

namespace App\Http\Controllers;

use App\Actions\Booking\CreateBooking;
use App\Actions\Booking\CancelBooking;
use App\DTOs\BookingData;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Requests\Booking\CancelBookingRequest;
use App\Models\Activity;
use App\Models\Booking;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function create(Activity $activity)
    {
        $activity->load(['area', 'category', 'availabilities' => fn ($q) => 
            $q->where('date', '>=', now()->toDateString())
              ->where('status', 'open')
              ->orderBy('date')
        ]);

        return Inertia::render('Booking/Create', [
            'activity' => $activity,
        ]);
    }

    public function store(StoreBookingRequest $request, Activity $activity, CreateBooking $createBooking)
    {
        $data = BookingData::fromRequest($request);
        $booking = $createBooking($data);
        
        return redirect()->route('booking.payment', $booking);
    }

    public function payment(Booking $booking)
    {
        $booking->load(['activity.area', 'activity.category', 'availability']);
        
        return Inertia::render('Booking/Payment', [
            'booking' => $booking,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function confirmation(Booking $booking)
    {
        $booking->load(['activity.area', 'activity.category', 'availability', 'payment']);
        
        return Inertia::render('Booking/Confirmation', [
            'booking' => $booking,
        ]);
    }

    public function cancel(CancelBookingRequest $request, Booking $booking, CancelBooking $cancelBooking)
    {
        $cancelBooking($booking, $request->input('reason'));
        
        return redirect()->route('dashboard.bookings')
            ->with('success', 'Booking cancelled successfully.');
    }
}
```

---

## Support Classes

### Booking Reference Generator

```php
<?php
// app/Support/Helpers/BookingReferenceGenerator.php

namespace App\Support\Helpers;

use App\Models\Booking;

class BookingReferenceGenerator
{
    /**
     * Generate booking reference: BOT-2025-XXXXXX
     */
    public function generate(): string
    {
        $year = now()->format('Y');
        
        do {
            $random = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
            $reference = "BOT-{$year}-{$random}";
        } while (Booking::where('reference', $reference)->exists());
        
        return $reference;
    }
}
```

### Price Helper

```php
<?php
// app/Support/Helpers/PriceHelper.php

namespace App\Support\Helpers;

class PriceHelper
{
    public static function formatIDR(int $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    public static function formatUSD(float $amount): string
    {
        return '$' . number_format($amount, 2);
    }

    public static function convertToUSD(int $idrAmount, float $rate = 15500): float
    {
        return round($idrAmount / $rate, 2);
    }
}
```

### HasUuid Trait

```php
<?php
// app/Support/Traits/HasUuid.php

namespace App\Support\Traits;

use Illuminate\Support\Str;

trait HasUuid
{
    protected static function bootHasUuid(): void
    {
        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }

    public function getIncrementing(): bool
    {
        return false;
    }

    public function getKeyType(): string
    {
        return 'string';
    }
}
```

---

## Laravel Octane Configuration

```php
<?php
// config/octane.php

return [
    'server' => env('OCTANE_SERVER', 'frankenphp'),

    'https' => env('OCTANE_HTTPS', false),

    'listeners' => [
        WorkerStarting::class => [
            EnsureUploadedFilesAreValid::class,
            EnsureUploadedFilesCanBeMoved::class,
        ],

        RequestReceived::class => [
            ...Octane::prepareApplicationForNextOperation(),
            ...Octane::prepareApplicationForNextRequest(),
        ],

        RequestTerminated::class => [
            FlushTemporaryContainerInstances::class,
        ],
    ],

    'warm' => [
        ...Octane::defaultServicesToWarm(),
    ],

    'flush' => [],

    'max_execution_time' => 30,
];
```

---

## Custom App Config

```php
<?php
// config/baliokatravel.php

return [
    'name' => 'BaliokaTravel',
    
    'currency' => [
        'primary' => 'IDR',
        'secondary' => 'USD',
        'usd_rate' => env('BALI_USD_EXCHANGE_RATE', 15500),
    ],
    
    'booking' => [
        'reference_prefix' => 'BOT',
        'service_fee_percent' => env('BALI_SERVICE_FEE_PERCENT', 5),
        'reminder_hours' => [24, 2],
        'cancellation_deadline_hours' => 24,
    ],
    
    'activity' => [
        'max_images' => 10,
        'max_image_size' => 2048,
        'cover_dimensions' => [800, 600],
    ],
    
    'pagination' => [
        'default' => 12,
        'admin' => 25,
    ],
];
```

---

## Routes

```php
<?php
// routes/web.php

use App\Http\Controllers\{
    HomeController,
    ActivityController,
    AreaController,
    BookingController,
    PaymentController,
    ReviewController,
    DashboardController,
    ProfileController,
    WebhookController,
};

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/search', [ActivityController::class, 'search'])->name('search');
Route::get('/activities/{activity:slug}', [ActivityController::class, 'show'])->name('activities.show');
Route::get('/areas/{area:slug}', [AreaController::class, 'show'])->name('areas.show');

// Auth routes
require __DIR__.'/auth.php';

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/bookings', [DashboardController::class, 'bookings'])->name('dashboard.bookings');
    
    // Booking flow
    Route::get('/book/{activity:slug}', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/book/{activity:slug}', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/booking/{booking}/payment', [BookingController::class, 'payment'])->name('booking.payment');
    Route::get('/booking/{booking}/confirmation', [BookingController::class, 'confirmation'])->name('booking.confirmation');
    Route::post('/booking/{booking}/cancel', [BookingController::class, 'cancel'])->name('booking.cancel');
    
    // Payment
    Route::post('/payment/{booking}/intent', [PaymentController::class, 'createIntent'])->name('payment.intent');
    
    // Reviews
    Route::post('/activities/{activity}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Webhooks (no CSRF)
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])
    ->name('webhooks.stripe')
    ->withoutMiddleware(['web']);
```

---

## Summary: Why Anti-Refactor?

| Aspect | Benefit |
|--------|---------|
| **Actions** | Single responsibility, easy to test, easy to find |
| **DTOs** | Type-safe, IDE autocomplete, validation in one place |
| **Queries** | Reusable, no duplicate queries, easy to optimize |
| **Thin Controllers** | Just routing, business logic elsewhere |
| **Events/Listeners** | Decoupled, easy to add new behaviors |
| **Support/** | Utilities organized, not scattered |

**Ketika butuh fitur baru:**
- Tambah Action baru → tidak ubah file lain
- Tambah Event → tidak ubah flow existing
- Tambah Query method → tidak ubah controller

**Tidak perlu refactor existing code!** ✅

---

## Next: See DATABASE.md for Models & Migrations →
