# 🌴 BaliokaTravel Documentation

## Laravel 11 + Octane + Inertia + React + Filament

Platform booking aktivitas wisata khusus Bali, Indonesia.

---

## 📚 Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [PROJECT_OVERVIEW.md](./01-overview/PROJECT_OVERVIEW.md) | Vision, scope, tech stack, timeline |
| 2 | [SPRINT_PLANNING.md](./01-overview/SPRINT_PLANNING.md) | Week-by-week development plan |
| 3 | [ARCHITECTURE.md](./02-architecture/ARCHITECTURE.md) | **Anti-refactor architecture**, Actions, DTOs |
| 4 | [DATABASE.md](./03-database/DATABASE.md) | Migrations, models, seeders |
| 5 | [FRONTEND.md](./04-frontend/FRONTEND.md) | React components, TypeScript, Zustand |
| 6 | [FILAMENT.md](./05-filament/FILAMENT.md) | Admin & Supplier panel setup |
| 7 | [DEPLOYMENT.md](./06-deployment/DEPLOYMENT.md) | Ubuntu VPS deployment guide |
| 8 | [GETTING_STARTED.md](./07-guides/GETTING_STARTED.md) | Quick start development guide |

---

## 🏗️ Architecture Pattern (Anti-Refactor)

```
app/
├── Actions/          # Single-purpose business logic
│   ├── Booking/
│   │   ├── CreateBooking.php
│   │   ├── ConfirmBooking.php
│   │   └── CancelBooking.php
│   └── Payment/
│       └── HandleStripeWebhook.php
├── DTOs/             # Type-safe data objects
│   ├── BookingData.php
│   └── SearchFiltersData.php
├── Queries/          # Reusable complex queries
│   └── ActivityQueries.php
├── Events/           # Domain events
├── Listeners/        # Event handlers
└── Support/          # Helpers & Traits
```

| Pattern | Benefit |
|---------|---------|
| **Actions** | 1 class = 1 tugas, mudah test |
| **DTOs** | Type-safe, IDE autocomplete |
| **Queries** | Reusable, DRY |
| **Events** | Decoupled side effects |

**Prinsip:** Tambah fitur baru = Tambah file baru. **Tidak ubah existing code!**

---

## 🛠️ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              Inertia.js + React + TypeScript                    │
│              shadcn/ui + Tailwind CSS                           │
└─────────────────────────────┬───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    LARAVEL 11 + OCTANE                          │
│      Breeze │ Eloquent │ Filament │ Sanctum │ Queue             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼───────┐     ┌───────▼───────┐     ┌───────▼───────┐
│  PostgreSQL   │     │     Redis     │     │    Stripe     │
└───────────────┘     └───────────────┘     └───────────────┘
```

---

## ⚡ Quick Start

```bash
# 1. Create project
laravel new baliokatravel
cd baliokatravel

# 2. Install Breeze + React + TypeScript
composer require laravel/breeze --dev
php artisan breeze:install react --typescript

# 3. Install Octane
composer require laravel/octane
php artisan octane:install --server=frankenphp

# 4. Install Filament
composer require filament/filament:"^3.2"
php artisan filament:install --panels

# 5. Setup database
php artisan migrate:fresh --seed

# 6. Run development server
php artisan octane:start --watch
npm run dev
```

---

## 🗺️ Bali Coverage

**13 Areas:** Ubud, Seminyak, Kuta, Canggu, Nusa Dua, Sanur, Uluwatu, Jimbaran, Kintamani, Nusa Penida, Nusa Lembongan, Amed, Lovina

**8 Categories:** Water Sports, Adventure, Culture, Food, Wellness, Tours, Island Hopping, Sunset

---

## 📅 Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| 1 | Week 1-2 | Setup, Auth, Database |
| 2 | Week 3-4 | Filament Admin/Supplier |
| 3 | Week 5-6 | Search, Activity Detail |
| 4 | Week 7-8 | Booking, Payment |
| 5 | Week 9-10 | Dashboard, Email, Reviews |
| 6 | Week 11-12 | Polish, Testing, Deploy |

**Total: 12 weeks**

---

## 🎨 Branding

| Element | Value |
|---------|-------|
| Name | BaliokaTravel |
| Domain | baliokatravel.com |
| Primary Color | #0EA5E9 (Tropical Blue) |
| Accent Color | #F97316 (Sunset Orange) |
| Booking Ref | BOT-2025-XXXXXX |
| Currency | IDR (primary), USD (secondary) |

---

## 🔗 Access Points

| Panel | URL | Role |
|-------|-----|------|
| Website | / | Public |
| Admin | /admin | Admin |
| Supplier | /supplier | Supplier |
| User Dashboard | /dashboard | Traveler |

---

## 📦 Key Packages

**Backend:**
- **laravel/octane** (FrankenPHP) - 10-20x faster! App stays in memory
- filament/filament - Admin panel dalam hitungan jam
- laravel/breeze - Auth siap pakai
- stripe/stripe-php
- resend/resend-laravel

**Frontend:**
- @inertiajs/react - SPA tanpa API terpisah
- shadcn/ui - Beautiful components
- zustand - Simple state management
- lucide-react
- date-fns

---

## 🚀 Production Deployment

See [DEPLOYMENT.md](./06-deployment/DEPLOYMENT.md) for complete Ubuntu VPS setup guide.

```bash
# Quick deploy
./deploy.sh
```

---

## 📞 Support

Created with ❤️ for Bali tourism.

**Version:** 1.0.0  
**Last Updated:** December 2025
