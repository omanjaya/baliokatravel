# 💻 Frontend Guide - BaliokaTravel

## Inertia.js + React + TypeScript + shadcn/ui

---

## Setup

### Install shadcn/ui Components

```bash
# Initialize shadcn (sudah termasuk di Breeze, tapi manual setup)
npx shadcn@latest init

# Add components yang dibutuhkan
npx shadcn@latest add button input card dialog sheet select calendar popover avatar badge separator skeleton tabs textarea dropdown-menu toast

# Install additional packages
npm install lucide-react date-fns zustand @tanstack/react-query
```

---

## TypeScript Types

```typescript
// resources/js/types/index.d.ts

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'traveler' | 'supplier' | 'admin';
    avatar?: string;
}

export interface BaliArea {
    id: string;
    name: string;
    description?: string;
    image_url?: string;
    popular_for?: string[];
}

export interface Category {
    id: string;
    name: string;
    icon?: string;
    image_url?: string;
}

export interface Activity {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description?: string;
    area: BaliArea;
    category: Category;
    supplier: User;
    duration_minutes: number;
    max_group_size: number;
    price_idr: number;
    price_usd?: number;
    child_price_idr?: number;
    cover_image?: string;
    images?: string[];
    highlights?: string[];
    included?: string[];
    excluded?: string[];
    languages?: string[];
    difficulty: 'easy' | 'moderate' | 'challenging';
    rating_average: number;
    review_count: number;
    is_featured: boolean;
}

export interface Availability {
    id: string;
    date: string;
    start_time: string;
    available_spots: number;
    status: 'open' | 'full' | 'cancelled';
}

export interface Booking {
    id: string;
    reference: string;
    activity: Activity;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    participants: { adults: number; children: number };
    total_amount: number;
    created_at: string;
}

export interface Review {
    id: string;
    user: User;
    rating: number;
    content: string;
    created_at: string;
}

export type PageProps<T = {}> = T & {
    auth: { user: User };
    flash: { success?: string; error?: string };
};
```

---

## Utility Functions

```typescript
// resources/js/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatIDR(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours && mins) return `${hours}h ${mins}m`;
    if (hours) return `${hours}h`;
    return `${mins}m`;
}
```

---

## Key Components

### Activity Card

```tsx
// resources/js/Components/Search/ActivityCard.tsx

import { Link } from '@inertiajs/react';
import { Star, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { formatIDR, formatUSD, formatDuration } from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityCardProps {
    activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
    return (
        <Link href={`/activities/${activity.slug}`}>
            <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                        src={activity.cover_image || '/images/placeholder.jpg'}
                        alt={activity.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    {activity.is_featured && (
                        <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>
                    )}
                    <Badge variant="secondary" className="absolute top-2 right-2">
                        {activity.area.name}
                    </Badge>
                </div>

                <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        {activity.category.name}
                    </p>

                    <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-sky-600">
                        {activity.title}
                    </h3>

                    <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{activity.rating_average.toFixed(1)}</span>
                        <span className="text-muted-foreground text-sm">
                            ({activity.review_count} reviews)
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(activity.duration_minutes)}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {activity.area.name}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg text-sky-600">
                            {formatIDR(activity.price_idr)}
                        </span>
                        {activity.price_usd && (
                            <span className="text-sm text-muted-foreground">
                                ~{formatUSD(activity.price_usd)}
                            </span>
                        )}
                        <span className="text-sm text-muted-foreground">/ person</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
```

### Search Box

```tsx
// resources/js/Components/Landing/SearchBox.tsx

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar as CalendarComponent } from '@/Components/ui/calendar';
import { format } from 'date-fns';

const AREAS = [
    { id: 'ubud', name: 'Ubud' },
    { id: 'seminyak', name: 'Seminyak' },
    { id: 'kuta', name: 'Kuta' },
    { id: 'canggu', name: 'Canggu' },
    { id: 'nusa_dua', name: 'Nusa Dua' },
    { id: 'uluwatu', name: 'Uluwatu' },
    { id: 'nusa_penida', name: 'Nusa Penida' },
];

export function SearchBox() {
    const [area, setArea] = useState('');
    const [date, setDate] = useState<Date | undefined>();
    const [guests, setGuests] = useState('2');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (area) params.set('area', area);
        if (date) params.set('date', format(date, 'yyyy-MM-dd'));
        if (guests) params.set('guests', guests);
        router.get(`/search?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-4">
                {/* Area */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Where</label>
                    <Select value={area} onValueChange={setArea}>
                        <SelectTrigger>
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                            {AREAS.map((a) => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Date */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">When</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                {date ? format(date, 'MMM dd') : 'Select date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(d) => d < new Date()}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Guests */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Guests</label>
                    <Select value={guests} onValueChange={setGuests}>
                        <SelectTrigger>
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <SelectItem key={n} value={n.toString()}>
                                    {n} {n === 1 ? 'guest' : 'guests'}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <Button onClick={handleSearch} className="w-full bg-sky-600 hover:bg-sky-700" size="lg">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}
```

### Booking Widget

```tsx
// resources/js/Components/Activity/BookingWidget.tsx

import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Calendar, Minus, Plus } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Calendar as CalendarComponent } from '@/Components/ui/calendar';
import { format } from 'date-fns';
import { formatIDR, formatUSD } from '@/lib/utils';
import type { Activity, Availability } from '@/types';

interface Props {
    activity: Activity;
    availabilities: Availability[];
}

export function BookingWidget({ activity, availabilities }: Props) {
    const [date, setDate] = useState<Date | undefined>();
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const adultPrice = activity.price_idr;
    const childPrice = activity.child_price_idr || activity.price_idr * 0.7;
    const subtotal = adults * adultPrice + children * childPrice;

    const availableDates = availabilities
        .filter((a) => a.status === 'open' && a.available_spots > 0)
        .map((a) => new Date(a.date));

    const handleBook = () => {
        if (!date) return;
        router.get(`/book/${activity.slug}`, {
            date: format(date, 'yyyy-MM-dd'),
            adults,
            children,
        });
    };

    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-sky-600">
                        {formatIDR(activity.price_idr)}
                    </span>
                    {activity.price_usd && (
                        <span className="text-sm text-muted-foreground">
                            ~{formatUSD(activity.price_usd)}
                        </span>
                    )}
                    <span className="text-sm font-normal text-muted-foreground">/ person</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Date Picker */}
                <div>
                    <label className="text-sm font-medium mb-1 block">Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                                <Calendar className="h-4 w-4 mr-2" />
                                {date ? format(date, 'EEEE, MMM dd, yyyy') : 'Select date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(d) =>
                                    d < new Date() ||
                                    !availableDates.some((ad) => ad.toDateString() === d.toDateString())
                                }
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Guests */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Guests</label>

                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">Adults</p>
                            <p className="text-sm text-muted-foreground">Age 13+</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                disabled={adults <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{adults}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setAdults(Math.min(activity.max_group_size, adults + 1))}
                                disabled={adults + children >= activity.max_group_size}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t">
                        <div>
                            <p className="font-medium">Children</p>
                            <p className="text-sm text-muted-foreground">Age 3-12</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                disabled={children <= 0}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{children}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setChildren(Math.min(activity.max_group_size - adults, children + 1))}
                                disabled={adults + children >= activity.max_group_size}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>{formatIDR(adultPrice)} × {adults} adults</span>
                        <span>{formatIDR(adults * adultPrice)}</span>
                    </div>
                    {children > 0 && (
                        <div className="flex justify-between text-sm">
                            <span>{formatIDR(childPrice)} × {children} children</span>
                            <span>{formatIDR(children * childPrice)}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span className="text-sky-600">{formatIDR(subtotal)}</span>
                    </div>
                </div>

                {/* Book Button */}
                <Button
                    onClick={handleBook}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                    disabled={!date}
                >
                    {date ? 'Book Now' : 'Select a date'}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    You won't be charged yet
                </p>
            </CardContent>
        </Card>
    );
}
```

---

## Zustand Stores

### Search Store

```typescript
// resources/js/stores/searchStore.ts

import { create } from 'zustand';

interface SearchFilters {
    keyword: string;
    area: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    sortBy: 'popular' | 'price_low' | 'price_high' | 'rating';
}

interface SearchStore {
    filters: SearchFilters;
    setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
    resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
    keyword: '',
    area: '',
    category: '',
    minPrice: 0,
    maxPrice: 10000000,
    sortBy: 'popular',
};

export const useSearchStore = create<SearchStore>((set) => ({
    filters: defaultFilters,
    setFilter: (key, value) =>
        set((state) => ({ filters: { ...state.filters, [key]: value } })),
    resetFilters: () => set({ filters: defaultFilters }),
}));
```

### Booking Store

```typescript
// resources/js/stores/bookingStore.ts

import { create } from 'zustand';
import type { Activity, Availability } from '@/types';

interface BookingState {
    activity: Activity | null;
    availability: Availability | null;
    participants: { adults: number; children: number };
    contactInfo: { name: string; email: string; phone: string };
    specialRequests: string;
    setActivity: (activity: Activity) => void;
    setAvailability: (availability: Availability) => void;
    setParticipants: (adults: number, children: number) => void;
    setContactInfo: (info: Partial<BookingState['contactInfo']>) => void;
    reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
    activity: null,
    availability: null,
    participants: { adults: 2, children: 0 },
    contactInfo: { name: '', email: '', phone: '' },
    specialRequests: '',
    setActivity: (activity) => set({ activity }),
    setAvailability: (availability) => set({ availability }),
    setParticipants: (adults, children) => set({ participants: { adults, children } }),
    setContactInfo: (info) => set((state) => ({ contactInfo: { ...state.contactInfo, ...info } })),
    reset: () => set({
        activity: null,
        availability: null,
        participants: { adults: 2, children: 0 },
        contactInfo: { name: '', email: '', phone: '' },
        specialRequests: '',
    }),
}));
```

---

## Pages

### Home Page

```tsx
// resources/js/Pages/Home.tsx

import { Head } from '@inertiajs/react';
import { GuestLayout } from '@/Layouts/GuestLayout';
import { Hero } from '@/Components/Landing/Hero';
import { FeaturedActivities } from '@/Components/Landing/FeaturedActivities';
import { BaliAreas } from '@/Components/Landing/BaliAreas';
import type { Activity, BaliArea, Category } from '@/types';

interface Props {
    featuredActivities: Activity[];
    areas: BaliArea[];
    categories: Category[];
}

export default function Home({ featuredActivities, areas, categories }: Props) {
    return (
        <GuestLayout>
            <Head title="Discover Amazing Bali Adventures" />
            <Hero />
            <FeaturedActivities activities={featuredActivities} />
            <BaliAreas areas={areas} />
        </GuestLayout>
    );
}
```

### Activity Detail Page

```tsx
// resources/js/Pages/Activities/Show.tsx

import { Head } from '@inertiajs/react';
import { GuestLayout } from '@/Layouts/GuestLayout';
import { ImageGallery } from '@/Components/Activity/ImageGallery';
import { ActivityInfo } from '@/Components/Activity/ActivityInfo';
import { BookingWidget } from '@/Components/Activity/BookingWidget';
import { ReviewsList } from '@/Components/Activity/ReviewsList';
import type { Activity, Availability, Review } from '@/types';

interface Props {
    activity: Activity;
    availabilities: Availability[];
    reviews: Review[];
}

export default function Show({ activity, availabilities, reviews }: Props) {
    return (
        <GuestLayout>
            <Head title={activity.title} />

            <div className="container py-8">
                <ImageGallery images={activity.images || [activity.cover_image || '']} />

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    <div className="lg:col-span-2">
                        <ActivityInfo activity={activity} />
                        <ReviewsList reviews={reviews} />
                    </div>

                    <div>
                        <BookingWidget activity={activity} availabilities={availabilities} />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
```

---

## Tailwind Config

```javascript
// tailwind.config.js

import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    darkMode: ['class'],
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],
    theme: {
        container: {
            center: true,
            padding: '1rem',
            screens: { '2xl': '1280px' },
        },
        extend: {
            colors: {
                'tropical-blue': '#0EA5E9',
                'sunset-orange': '#F97316',
                'palm-green': '#22C55E',
                sand: '#FFFBEB',
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
```

---

## Next: Continue to Filament Guide →
