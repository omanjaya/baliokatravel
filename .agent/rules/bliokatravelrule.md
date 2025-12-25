---
trigger: always_on
glob:
description:
# Project Rules - BaliOkayTravel

## Documentation First
ALWAYS read documentation in /mnt/project/ before writing any code:
- Read ARCHITECTURE.md before creating any PHP class
- Read DATABASE.md before creating migrations or models
- Read FRONTEND.md before creating React components
- Read FILAMENT.md before creating admin resources

## Backend Rules

### Architecture Pattern (Mandatory)
1. **Actions/** - One class = One job
   - CreateBooking.php, ConfirmBooking.php, CancelBooking.php
   - Use __invoke() method
   - Inject dependencies via constructor

2. **DTOs/** - Type-safe data objects
   - Use readonly class
   - Always create fromRequest() static factory
   - Never pass raw arrays between classes

3. **Queries/** - Complex database queries
   - ActivityQueries::search(), ::featured(), ::byArea()
   - Return Collections or Paginators
   - Keep Models lean

4. **Controllers** - Thin, routing only
   - Max 10-15 lines per method
   - Inject Actions via method parameters
   - No business logic

### Naming Conventions
- Actions: Verb + Noun (CreateBooking, ProcessRefund, SendConfirmation)
- DTOs: Noun + Data (BookingData, SearchFiltersData)
- Queries: Model + Queries (ActivityQueries, BookingQueries)
- Events: Noun + Past Verb (BookingCreated, PaymentReceived)

### Database
- All IDs use UUID
- Use Enums for status fields (BookingStatus, ActivityStatus, PaymentStatus)
- Prices stored in IDR (integer)
- Timestamps on all tables

## Frontend Rules

### File Organization
- /Components/common/ - Reusable (Rating, PriceDisplay, LoadingSpinner)
- /Components/activity/ - Activity-specific (ActivityCard, ActivityGallery)
- /Components/booking/ - Booking flow (BookingWidget, PriceSummary)
- /Components/search/ - Search (SearchBox, FilterSidebar)
- /Components/ui/ - shadcn/ui components

### State Management
- Zustand for global state (searchStore, bookingStore)
- React state for local component state
- Inertia useForm for forms

### Styling
- Tailwind CSS only (no custom CSS unless necessary)
- Use cn() utility for conditional classes
- Follow brand colors: tropical-blue (#0EA5E9), sunset-orange (#F97316), palm-green (#22C55E)

## Code Quality

### Before Writing Code
1. Check if similar code exists in documentation
2. Follow existing patterns - don't invent new ones
3. Ask if unsure about architecture decisions

### When Creating New Features
1. Create Action class for business logic
2. Create DTO for data transfer
3. Add Query methods if needed
4. Keep Controller thin
5. Dispatch Events for side effects

### Testing Priority
1. Actions (unit tests)
2. API endpoints (feature tests)
3. Critical user flows (browser tests)

## Common Mistakes to Avoid
- ❌ Business logic in Controller
- ❌ Business logic in Model
- ❌ Monolithic Service classes
- ❌ Passing arrays instead of DTOs
- ❌ Fat Controllers with 50+ lines
- ❌ Creating new patterns not in ARCHITECTURE.md
---

