# 📅 Sprint Planning - BaliokaTravel

## Laravel 11 + Octane + Inertia + React + Filament

**Timeline:** 12 minggu (3 bulan)  
**Sprint:** 1 minggu per sprint

---

## Kenapa Lebih Cepat dengan Laravel?

| Task | Manual | Dengan Laravel |
|------|--------|----------------|
| Auth system | 3-5 hari | **5 menit** (Breeze) |
| Admin panel | 2-3 minggu | **1-2 hari** (Filament) |
| CRUD operations | 2-3 hari per entity | **30 menit** (Filament Resource) |
| Form validation | Manual semua | **Built-in** (Form Requests) |
| File upload | Setup S3, etc | **Built-in** (Storage) |
| Email | Setup service | **Built-in** (Mail) |
| Queue | Setup worker | **Built-in** (Queue) |

---

## Phase 1: Foundation (Week 1-2)

### Week 1: Project Setup

**Goal:** Laravel project running dengan auth

**Tasks:**

```bash
# Create project
laravel new baliokatravel

# Install Breeze dengan Inertia + React + TypeScript
composer require laravel/breeze --dev
php artisan breeze:install react --typescript --pest

# Install Octane
composer require laravel/octane
php artisan octane:install --server=frankenphp

# Install Filament
composer require filament/filament
php artisan filament:install --panels

# Additional packages
composer require spatie/laravel-permission
composer require stripe/stripe-php
composer require resend/resend-laravel

# Frontend dependencies
npm install
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-popover
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react date-fns
npm install @tanstack/react-query zustand
```

**Deliverables:**
- ✅ Laravel 11 project created
- ✅ Breeze auth working (login, register, forgot password)
- ✅ Inertia + React + TypeScript setup
- ✅ Octane installed
- ✅ Filament admin panel accessible
- ✅ Git repository initialized

---

### Week 2: Database & Models

**Goal:** Database schema complete dengan migrations

**Tasks:**

1. **Create Migrations:**
   ```bash
   php artisan make:migration create_bali_areas_table
   php artisan make:migration create_categories_table
   php artisan make:migration create_activities_table
   php artisan make:migration create_activity_availabilities_table
   php artisan make:migration create_bookings_table
   php artisan make:migration create_payments_table
   php artisan make:migration create_reviews_table
   php artisan make:migration add_role_to_users_table
   ```

2. **Create Models:**
   ```bash
   php artisan make:model BaliArea
   php artisan make:model Category
   php artisan make:model Activity
   php artisan make:model ActivityAvailability
   php artisan make:model Booking
   php artisan make:model Payment
   php artisan make:model Review
   ```

3. **Setup Relationships** di setiap model

4. **Create Seeders:**
   ```bash
   php artisan make:seeder BaliAreaSeeder
   php artisan make:seeder CategorySeeder
   php artisan make:seeder DemoActivitySeeder
   ```

5. **Run migrations & seeders:**
   ```bash
   php artisan migrate:fresh --seed
   ```

**Deliverables:**
- ✅ All migrations created
- ✅ All models with relationships
- ✅ Seeders untuk Bali areas & categories
- ✅ Demo activities seeded

---

## Phase 2: Admin & Supplier Panel (Week 3-4)

### Week 3: Filament Admin Panel

**Goal:** Admin dapat manage semua data

**Tasks:**

1. **Create Filament Resources:**
   ```bash
   php artisan make:filament-resource BaliArea
   php artisan make:filament-resource Category
   php artisan make:filament-resource Activity
   php artisan make:filament-resource Booking
   php artisan make:filament-resource User
   ```

2. **Setup Admin features:**
   - Activity approval workflow
   - User management
   - Booking overview
   - Basic analytics widgets

3. **Create Dashboard Widgets:**
   ```bash
   php artisan make:filament-widget StatsOverview
   php artisan make:filament-widget LatestBookings
   php artisan make:filament-widget RevenueChart
   ```

**Deliverables:**
- ✅ Full admin CRUD untuk semua entities
- ✅ Activity approval system
- ✅ Dashboard dengan statistics
- ✅ User role management

---

### Week 4: Supplier Panel

**Goal:** Supplier dapat manage activities & bookings

**Tasks:**

1. **Create Supplier Panel:**
   ```bash
   php artisan make:filament-panel supplier
   ```

2. **Supplier Resources:**
   - My Activities (CRUD)
   - My Bookings (view, confirm, reject)
   - Availability Calendar
   - Profile settings

3. **Setup Authorization:**
   - Supplier hanya lihat data sendiri
   - Policy untuk setiap resource

**Deliverables:**
- ✅ Separate supplier panel
- ✅ Activity management untuk supplier
- ✅ Booking management
- ✅ Proper authorization

---

## Phase 3: Public Frontend (Week 5-6)

### Week 5: Homepage & Activity Listing

**Goal:** Visitor dapat browse activities

**Tasks:**

1. **Setup shadcn/ui:**
   - Install components yang dibutuhkan
   - Setup Tailwind config

2. **Create Pages (Inertia):**
   ```
   resources/js/Pages/
   ├── Home.tsx
   ├── Search.tsx
   ├── Activities/
   │   ├── Index.tsx
   │   └── Show.tsx
   └── Areas/
       └── Show.tsx
   ```

3. **Create Components:**
   ```
   resources/js/Components/
   ├── Layout/
   │   ├── Header.tsx
   │   ├── Footer.tsx
   │   └── MobileNav.tsx
   ├── Landing/
   │   ├── Hero.tsx
   │   ├── SearchBox.tsx
   │   ├── FeaturedActivities.tsx
   │   └── BaliAreas.tsx
   └── Activity/
       ├── ActivityCard.tsx
       └── ActivityGrid.tsx
   ```

4. **Create Controllers:**
   ```bash
   php artisan make:controller HomeController
   php artisan make:controller ActivityController
   php artisan make:controller AreaController
   ```

**Deliverables:**
- ✅ Beautiful homepage
- ✅ Activity listing dengan cards
- ✅ Area pages
- ✅ Responsive design

---

### Week 6: Search & Activity Detail

**Goal:** Search working & activity detail page

**Tasks:**

1. **Search Functionality:**
   - Search by keyword
   - Filter by area
   - Filter by category
   - Filter by price range
   - Sort options
   - Pagination

2. **Activity Detail Page:**
   - Image gallery
   - Activity info
   - Availability calendar
   - Booking widget
   - Location map
   - Reviews section

3. **Create Components:**
   ```
   resources/js/Components/
   ├── Search/
   │   ├── SearchBar.tsx
   │   ├── FilterSidebar.tsx
   │   └── SearchResults.tsx
   └── Activity/
       ├── ImageGallery.tsx
       ├── ActivityInfo.tsx
       ├── AvailabilityCalendar.tsx
       ├── BookingWidget.tsx
       └── ReviewsList.tsx
   ```

**Deliverables:**
- ✅ Full search dengan filters
- ✅ Activity detail page
- ✅ Availability display
- ✅ Mobile responsive

---

## Phase 4: Booking & Payment (Week 7-8)

### Week 7: Booking Flow

**Goal:** User dapat melakukan booking

**Tasks:**

1. **Booking Flow Pages:**
   ```
   resources/js/Pages/Booking/
   ├── Create.tsx      # Select date, participants
   ├── Details.tsx     # Contact info, special requests
   ├── Review.tsx      # Review before payment
   └── Confirmation.tsx # Success page
   ```

2. **Create Booking Logic:**
   ```bash
   php artisan make:controller BookingController
   php artisan make:request CreateBookingRequest
   php artisan make:service BookingService
   ```

3. **Booking Features:**
   - Date & time selection
   - Participant count (adults, children)
   - Price calculation
   - Contact information
   - Special requests
   - Generate booking reference (BOT-2025-XXXXXX)

**Deliverables:**
- ✅ Multi-step booking form
- ✅ Real-time price calculation
- ✅ Availability checking
- ✅ Booking reference generation

---

### Week 8: Payment Integration

**Goal:** Stripe payment working

**Tasks:**

1. **Stripe Setup:**
   ```bash
   composer require stripe/stripe-php
   ```

2. **Payment Flow:**
   - Create Payment Intent
   - Stripe Elements form
   - Handle success/failure
   - Webhook handler

3. **Create Payment Logic:**
   ```bash
   php artisan make:controller PaymentController
   php artisan make:service StripeService
   ```

4. **Payment Features:**
   - Support IDR & USD
   - Payment Intent creation
   - Webhook handling
   - Refund capability

**Deliverables:**
- ✅ Stripe checkout working
- ✅ Payment creates confirmed booking
- ✅ Webhook updates status
- ✅ Multi-currency support

---

## Phase 5: Email & User Features (Week 9-10)

### Week 9: Email System

**Goal:** Transactional emails working

**Tasks:**

1. **Setup Resend:**
   ```bash
   composer require resend/resend-laravel
   ```

2. **Create Mailables:**
   ```bash
   php artisan make:mail BookingConfirmation
   php artisan make:mail PaymentReceipt
   php artisan make:mail BookingReminder
   php artisan make:mail WelcomeEmail
   ```

3. **Email Templates:**
   - Booking confirmation
   - Payment receipt
   - Booking reminder (1 day before)
   - Welcome email
   - Password reset

4. **Queue Emails:**
   ```bash
   php artisan make:job SendBookingConfirmation
   php artisan make:job SendBookingReminder
   ```

**Deliverables:**
- ✅ All email templates
- ✅ Queued email sending
- ✅ Email preview in browser

---

### Week 10: User Dashboard & Reviews

**Goal:** User dapat manage bookings & write reviews

**Tasks:**

1. **User Dashboard Pages:**
   ```
   resources/js/Pages/Dashboard/
   ├── Index.tsx           # Overview
   ├── Bookings/
   │   ├── Index.tsx       # List bookings
   │   └── Show.tsx        # Booking detail
   ├── Reviews/
   │   └── Index.tsx       # My reviews
   └── Settings/
       └── Index.tsx       # Profile settings
   ```

2. **Review System:**
   - Rating (1-5 stars)
   - Written review
   - Photo upload
   - Verified purchase badge
   - Supplier response

3. **Create Review Logic:**
   ```bash
   php artisan make:controller ReviewController
   php artisan make:request CreateReviewRequest
   ```

**Deliverables:**
- ✅ User dashboard
- ✅ Booking management
- ✅ Review system
- ✅ Profile settings

---

## Phase 6: Polish & Launch (Week 11-12)

### Week 11: Testing & Optimization

**Goal:** Production-ready application

**Tasks:**

1. **Testing:**
   ```bash
   php artisan make:test BookingTest
   php artisan make:test PaymentTest
   php artisan make:test ActivityTest
   ```

2. **Performance:**
   - Database indexing
   - Query optimization
   - Redis caching
   - Image optimization
   - Lazy loading

3. **Security:**
   - Rate limiting
   - CSRF protection
   - Input validation
   - SQL injection prevention
   - XSS prevention

4. **SEO:**
   - Meta tags
   - Open Graph
   - Sitemap
   - robots.txt

**Deliverables:**
- ✅ Test coverage
- ✅ Performance optimized
- ✅ Security hardened
- ✅ SEO ready

---

### Week 12: Deployment

**Goal:** Live on production!

**Tasks:**

1. **Server Setup:**
   - Ubuntu server hardening
   - Nginx configuration
   - PHP 8.3 setup
   - PostgreSQL setup
   - Redis setup
   - SSL certificate

2. **Deploy:**
   - Git clone to server
   - Environment setup
   - Run migrations
   - Seed production data
   - Start Octane
   - Setup supervisor

3. **Monitoring:**
   - Laravel Telescope (dev)
   - Error tracking
   - Uptime monitoring
   - Backup setup

**Deliverables:**
- 🚀 **LIVE on baliokatravel.com!**

---

## Commands Cheatsheet

```bash
# Development
php artisan serve                    # Standard server
php artisan octane:start --watch     # Octane with hot reload

# Database
php artisan migrate:fresh --seed     # Reset & seed
php artisan db:seed --class=DemoSeeder

# Filament
php artisan make:filament-resource Activity
php artisan make:filament-widget StatsOverview
php artisan make:filament-page Settings

# Testing
php artisan test
php artisan test --filter=BookingTest

# Cache
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Queue
php artisan queue:work
php artisan queue:listen

# Production
php artisan optimize
php artisan octane:start --workers=4 --task-workers=2
```

---

## File Structure Preview

```
baliokatravel/
├── app/
│   ├── Filament/
│   │   ├── Admin/           # Admin panel
│   │   └── Supplier/        # Supplier panel
│   ├── Http/
│   │   └── Controllers/
│   ├── Models/
│   ├── Services/
│   └── Enums/
├── resources/
│   └── js/
│       ├── Components/
│       ├── Layouts/
│       ├── Pages/
│       └── types/
├── routes/
│   └── web.php
└── database/
    ├── migrations/
    └── seeders/
```
