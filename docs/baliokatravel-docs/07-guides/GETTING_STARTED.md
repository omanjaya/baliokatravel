# 🚀 Getting Started - BaliokaTravel

## Quick Start Guide untuk Development

---

## Prerequisites

- PHP 8.3+
- Composer 2+
- Node.js 20+
- PostgreSQL 15+
- Redis

---

## Step 1: Create Laravel Project

```bash
# Create new Laravel project
laravel new baliokatravel

cd baliokatravel
```

---

## Step 2: Install Breeze (Inertia + React + TypeScript)

```bash
composer require laravel/breeze --dev

php artisan breeze:install react --typescript --pest

npm install
```

---

## Step 3: Install Additional Packages

### Backend Packages

```bash
# Laravel Octane
composer require laravel/octane
php artisan octane:install --server=frankenphp

# Filament Admin
composer require filament/filament:"^3.2"
php artisan filament:install --panels

# Additional
composer require spatie/laravel-permission
composer require stripe/stripe-php
composer require resend/resend-laravel
```

### Frontend Packages

```bash
# shadcn/ui setup
npx shadcn@latest init

# Add components
npx shadcn@latest add button input card dialog select calendar popover badge avatar separator skeleton tabs

# Additional packages
npm install lucide-react date-fns zustand @tanstack/react-query
```

---

## Step 4: Configure Database

### PostgreSQL Setup

```bash
# Create database (via psql)
createdb baliokatravel

# Or via command
sudo -u postgres psql -c "CREATE DATABASE baliokatravel;"
```

### Environment Configuration

```bash
cp .env.example .env
```

Edit `.env`:
```env
APP_NAME=BaliokaTravel
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=baliokatravel
DB_USERNAME=postgres
DB_PASSWORD=your_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
```

---

## Step 5: Create Migrations

```bash
# Create migrations
php artisan make:migration create_bali_areas_table
php artisan make:migration create_categories_table
php artisan make:migration create_activities_table
php artisan make:migration create_activity_availabilities_table
php artisan make:migration create_bookings_table
php artisan make:migration create_payments_table
php artisan make:migration create_reviews_table
php artisan make:migration add_role_to_users_table
```

Copy migration code dari `DATABASE.md` ke masing-masing file.

---

## Step 6: Create Models

```bash
php artisan make:model BaliArea
php artisan make:model Category
php artisan make:model Activity
php artisan make:model ActivityAvailability
php artisan make:model Booking
php artisan make:model Payment
php artisan make:model Review
```

Copy model code dari `DATABASE.md`.

---

## Step 7: Create Enums

```bash
mkdir -p app/Enums
```

Create files:
- `app/Enums/UserRole.php`
- `app/Enums/ActivityStatus.php`
- `app/Enums/BookingStatus.php`
- `app/Enums/Difficulty.php`
- `app/Enums/CancellationPolicy.php`

---

## Step 8: Create Seeders

```bash
php artisan make:seeder BaliAreaSeeder
php artisan make:seeder CategorySeeder
```

Copy seeder code dari `DATABASE.md`.

---

## Step 9: Run Migrations

```bash
php artisan migrate:fresh --seed
```

---

## Step 10: Create Filament Resources

```bash
# Admin panel resources
php artisan make:filament-resource Activity --panel=admin
php artisan make:filament-resource Booking --panel=admin
php artisan make:filament-resource User --panel=admin
php artisan make:filament-resource BaliArea --panel=admin
php artisan make:filament-resource Category --panel=admin

# Supplier panel
php artisan make:filament-panel supplier
php artisan make:filament-resource Activity --panel=supplier
php artisan make:filament-resource Booking --panel=supplier

# Widgets
php artisan make:filament-widget StatsOverview --panel=admin
php artisan make:filament-widget LatestBookings --panel=admin --table
```

---

## Step 11: Create Admin User

```bash
php artisan make:filament-user

# Enter:
# Name: Admin
# Email: admin@baliokatravel.com
# Password: your_password
```

Update user role di database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@baliokatravel.com';
```

---

## Step 12: Create Controllers

```bash
php artisan make:controller HomeController
php artisan make:controller ActivityController
php artisan make:controller AreaController
php artisan make:controller BookingController
php artisan make:controller PaymentController
php artisan make:controller ReviewController
php artisan make:controller DashboardController
php artisan make:controller WebhookController
```

---

## Step 13: Setup Routes

Edit `routes/web.php`:

```php
<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BookingController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/search', [ActivityController::class, 'search'])->name('search');
Route::get('/activities/{activity:slug}', [ActivityController::class, 'show'])->name('activities.show');
Route::get('/areas/{area}', [AreaController::class, 'show'])->name('areas.show');

// Auth routes (Breeze)
require __DIR__.'/auth.php';

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/bookings', [DashboardController::class, 'bookings'])->name('dashboard.bookings');
    
    // Booking
    Route::get('/book/{activity:slug}', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/book/{activity:slug}', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/book/{booking}/payment', [BookingController::class, 'payment'])->name('booking.payment');
    Route::get('/book/{booking}/confirmation', [BookingController::class, 'confirmation'])->name('booking.confirmation');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
});

// Webhooks
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])->name('webhooks.stripe');
```

---

## Step 14: Create Frontend Pages

Create Inertia pages di `resources/js/Pages/`:

```
Pages/
├── Home.tsx
├── Search.tsx
├── Activities/
│   └── Show.tsx
├── Booking/
│   ├── Create.tsx
│   ├── Payment.tsx
│   └── Confirmation.tsx
└── Dashboard/
    ├── Index.tsx
    └── Bookings/
        └── Index.tsx
```

---

## Step 15: Run Development Server

```bash
# Terminal 1: Laravel
php artisan octane:start --watch

# Terminal 2: Vite
npm run dev
```

---

## Access Points

| URL | Description |
|-----|-------------|
| http://localhost:8000 | Frontend |
| http://localhost:8000/admin | Admin Panel |
| http://localhost:8000/supplier | Supplier Panel |

---

## Development Commands

```bash
# Start Octane (hot reload)
php artisan octane:start --watch

# Start Vite
npm run dev

# Run migrations
php artisan migrate

# Fresh migrate with seed
php artisan migrate:fresh --seed

# Clear cache
php artisan optimize:clear

# Create Filament resource
php artisan make:filament-resource ModelName

# Run tests
php artisan test

# Queue worker
php artisan queue:work
```

---

## Project Structure

```
baliokatravel/
├── app/
│   ├── Enums/              # Status enums
│   ├── Filament/
│   │   ├── Admin/          # Admin panel
│   │   └── Supplier/       # Supplier panel
│   ├── Http/Controllers/   # Web controllers
│   ├── Models/             # Eloquent models
│   └── Services/           # Business logic
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/js/
│   ├── Components/         # React components
│   ├── Layouts/           # Page layouts
│   ├── Pages/             # Inertia pages
│   ├── stores/            # Zustand stores
│   └── types/             # TypeScript types
└── routes/
    └── web.php
```

---

## Next Steps

1. ✅ Setup complete
2. 📝 Build frontend pages (copy from FRONTEND.md)
3. 🎛️ Configure Filament resources (copy from FILAMENT.md)
4. 💳 Integrate Stripe payments
5. 📧 Setup email notifications
6. 🧪 Write tests
7. 🚀 Deploy to production (see DEPLOYMENT.md)

---

## Troubleshooting

### Port 8000 already in use
```bash
php artisan octane:start --port=8080
```

### Redis connection refused
```bash
# Start Redis
sudo service redis-server start
```

### Database connection error
```bash
# Check PostgreSQL
sudo service postgresql status
sudo service postgresql start
```

### Filament not loading
```bash
php artisan filament:optimize
php artisan view:clear
```

---

## 🎉 Happy Coding!

Dokumentasi lengkap:
- [PROJECT_OVERVIEW.md](./01-overview/PROJECT_OVERVIEW.md)
- [SPRINT_PLANNING.md](./01-overview/SPRINT_PLANNING.md)
- [ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md)
- [DATABASE.md](./03-database/DATABASE.md)
- [FRONTEND.md](./04-frontend/FRONTEND.md)
- [FILAMENT.md](./05-filament/FILAMENT.md)
- [DEPLOYMENT.md](./06-deployment/DEPLOYMENT.md)
