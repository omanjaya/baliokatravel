# 🌴 BaliokaTravel - Project Overview

## Platform booking aktivitas wisata khusus Bali, Indonesia

**Domain:** baliokatravel.com  
**Stack:** Laravel 11 + Octane + Inertia + React

---

## 🎯 Visi

Menjadi platform booking aktivitas wisata #1 di Bali yang dipercaya wisatawan domestik dan internasional.

---

## 🗺️ Scope: BALI ONLY

### Destinasi (13 Areas)

| ID | Area | Terkenal Untuk |
|----|------|----------------|
| `ubud` | Ubud | Sawah, seni, yoga, budaya |
| `seminyak` | Seminyak | Beach club, shopping, restoran |
| `kuta` | Kuta | Surfing, nightlife, budget |
| `canggu` | Canggu | Surfing, cafe, digital nomad |
| `nusa_dua` | Nusa Dua | Resort mewah, water sports |
| `sanur` | Sanur | Pantai tenang, sunrise, keluarga |
| `uluwatu` | Uluwatu | Pura, tebing, surfing |
| `jimbaran` | Jimbaran | Seafood, sunset dinner |
| `kintamani` | Kintamani | Gunung Batur, trekking |
| `nusa_penida` | Nusa Penida | Snorkeling, foto, adventure |
| `nusa_lembongan` | Nusa Lembongan | Diving, mangrove |
| `amed` | Amed | Diving, snorkeling, tenang |
| `lovina` | Lovina | Lumba-lumba, Bali utara |

### Kategori Aktivitas (8 Categories)

| ID | Kategori | Contoh |
|----|----------|--------|
| `water_sports` | Water Sports | Surfing, diving, snorkeling, rafting, parasailing |
| `adventure` | Adventure | Trekking, ATV, cycling, bungee, swing |
| `culture` | Culture & Temples | Temple tour, tari kecak, upacara |
| `food` | Food & Cooking | Cooking class, food tour, coffee plantation |
| `wellness` | Wellness | Spa, yoga, meditation, healing |
| `tours` | Tours & Sightseeing | Day tour, photo tour, private driver |
| `island_hopping` | Island Hopping | Nusa Penida, Gili, boat trip |
| `sunset` | Sunset Activities | Beach club, dinner cruise, sunset point |

---

## 🛠️ Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Laravel 11** | PHP Framework |
| **Octane** | High-performance server (FrankenPHP/Swoole) |
| **PostgreSQL** | Primary database |
| **Redis** | Cache, session, queue |
| **Sanctum** | API authentication |

### Frontend

| Technology | Purpose |
|------------|---------|
| **Inertia.js** | SPA adapter (no API needed) |
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |

### Admin & Dashboard

| Technology | Purpose |
|------------|---------|
| **Filament 3** | Admin panel & supplier dashboard |

### Services

| Service | Purpose |
|---------|---------|
| **Stripe** | Payment processing |
| **Resend** | Transactional emails |
| **Local Storage** | File uploads (VPS) |

### Server

| Technology | Purpose |
|------------|---------|
| **Ubuntu 22.04** | Operating system |
| **Nginx** | Reverse proxy |
| **Supervisor** | Process manager |
| **Let's Encrypt** | SSL certificate |

---

## 💰 Business Model

### Revenue Streams

1. **Commission** - 10-15% per booking
2. **Featured Listings** - Supplier bayar untuk promosi
3. **Premium Subscription** - Fitur advanced untuk supplier

### Currency

| Type | Currency | Format |
|------|----------|--------|
| Primary | IDR | Rp 500.000 |
| Secondary | USD | $35.00 |

Display: **"Rp 500.000 / ~$35"**

---

## 👥 User Roles

| Role | Akses |
|------|-------|
| `guest` | Browse, search activities |
| `traveler` | Book, review, manage bookings |
| `supplier` | Manage activities, handle bookings |
| `admin` | Full access, approve activities, analytics |

---

## 📅 Timeline

**Total: 10-12 minggu** dengan Laravel + Filament

| Phase | Minggu | Focus |
|-------|--------|-------|
| 1 | 1-2 | Setup, Auth, Database |
| 2 | 3-4 | Activities CRUD, Filament Admin |
| 3 | 5-6 | Search, Filter, Detail Page |
| 4 | 7-8 | Booking Flow, Payment |
| 5 | 9-10 | Dashboards, Email, Reviews |
| 6 | 11-12 | Polish, Testing, Deploy |

---

## 🎨 Branding

### Identity

- **Name:** BaliokaTravel
- **Domain:** baliokatravel.com
- **Tagline:** "Your Gateway to Bali Adventures"
- **Booking Ref:** BOT-2025-XXXXXX

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| Tropical Blue | `#0EA5E9` | Primary, buttons, links |
| Sunset Orange | `#F97316` | Accent, CTA, highlights |
| Palm Green | `#22C55E` | Success, badges |
| Sand | `#FFFBEB` | Background warmth |
| Charcoal | `#1E293B` | Text |

### Typography

- **Headings:** Plus Jakarta Sans (or Inter)
- **Body:** Inter

---

## 📊 Success Metrics (Year 1)

| Metric | Target |
|--------|--------|
| Registered Users | 5,000+ |
| Listed Activities | 200+ |
| Monthly Bookings | 500+ |
| Supplier Partners | 50+ |
| Average Rating | 4.5+ ⭐ |
| Monthly Revenue | Rp 50jt+ |

---

## 🚀 MVP Features

### Must Have (Launch)

- [x] User auth (email, Google)
- [x] Browse activities by area/category
- [x] Search with filters
- [x] Activity detail page
- [x] Booking flow
- [x] Stripe payment (IDR/USD)
- [x] Email confirmations
- [x] User dashboard
- [x] Supplier dashboard (Filament)
- [x] Admin panel (Filament)

### Nice to Have (Post-Launch)

- [ ] Reviews & ratings
- [ ] Wishlist
- [ ] Promo codes
- [ ] WhatsApp notifications
- [ ] Multi-language (ID/EN)
- [ ] Mobile app

---

## 📁 Quick Links

| Doc | Description |
|-----|-------------|
| [SPRINT_PLANNING.md](./SPRINT_PLANNING.md) | Detailed weekly tasks |
| [ARCHITECTURE.md](../02-architecture/ARCHITECTURE.md) | Folder structure |
| [DATABASE.md](../03-database/DATABASE.md) | Migrations & models |
| [FRONTEND.md](../04-frontend/FRONTEND.md) | React components |
| [FILAMENT.md](../05-filament/FILAMENT.md) | Admin & supplier panel |
| [DEPLOYMENT.md](../06-deployment/DEPLOYMENT.md) | VPS setup guide |
