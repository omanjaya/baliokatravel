import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    ArrowLeft,
    Plus,
    Minus,
    CheckCircle,
    Shield,
    Info
} from 'lucide-react';
import { formatIDR, formatDuration } from '@/lib/utils';
import { Rating } from '@/components/common/Rating';
import type { Activity, Availability, User } from '@/types';
import { FormEventHandler, useState, useMemo } from 'react';

interface Props {
    activity: Activity;
    availabilities: Availability[];
    auth: { user?: User };
}

export default function Create({ activity, availabilities, auth }: Props) {
    const SERVICE_FEE_PERCENT = 0.05;

    const { data, setData, post, processing, errors } = useForm({
        activity_id: activity.id,
        availability_id: '',
        adults: 1,
        children: 0,
        contact_name: auth.user?.name ?? '',
        contact_email: auth.user?.email ?? '',
        contact_phone: auth.user?.phone ?? '',
        special_requests: '',
    });

    // Group availabilities by date
    const groupedAvailabilities = useMemo(() => {
        const grouped: Record<string, Availability[]> = {};
        availabilities.forEach(avail => {
            if (!grouped[avail.date]) {
                grouped[avail.date] = [];
            }
            grouped[avail.date].push(avail);
        });
        return grouped;
    }, [availabilities]);

    const [selectedDate, setSelectedDate] = useState<string>('');

    // Price calculation
    const childPrice = activity.child_price_idr ?? Math.round(activity.price_idr * 0.7);
    const adultTotal = data.adults * activity.price_idr;
    const childTotal = data.children * childPrice;
    const subtotal = adultTotal + childTotal;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_PERCENT);
    const totalAmount = subtotal + serviceFee;
    const totalParticipants = data.adults + data.children;

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('booking.store'));
    };

    const adjustParticipants = (type: 'adults' | 'children', delta: number) => {
        const newValue = data[type] + delta;
        if (type === 'adults' && newValue >= 1 && newValue <= 10) {
            setData('adults', newValue);
        } else if (type === 'children' && newValue >= 0 && newValue <= 10) {
            setData('children', newValue);
        }
    };

    const selectedAvailability = availabilities.find(a => a.id === data.availability_id);
    const canSubmit = data.availability_id
        && data.contact_name
        && data.contact_email
        && data.contact_phone
        && totalParticipants <= activity.max_group_size;

    return (
        <AuthenticatedLayout>
            <Head title={`Book ${activity.title}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container py-4">
                        <Link
                            href={`/activities/${activity.slug}`}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to activity
                        </Link>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="max-w-5xl mx-auto">
                        <h1 className="text-2xl lg:text-3xl font-bold mb-2">Complete Your Booking</h1>
                        <p className="text-muted-foreground mb-8">
                            Fill in the details below to reserve your spot
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="grid lg:grid-cols-3 gap-8">
                                {/* Main Form */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Step 1: Date & Time */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">1</span>
                                                Select Date & Time
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Date Pills */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {Object.keys(groupedAvailabilities).slice(0, 7).map(date => (
                                                    <button
                                                        key={date}
                                                        type="button"
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDate === date
                                                                ? 'bg-sky-600 text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {new Date(date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Time Slots */}
                                            {selectedDate && groupedAvailabilities[selectedDate] && (
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-muted-foreground mb-3">
                                                        Available times for {new Date(selectedDate).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                        {groupedAvailabilities[selectedDate].map(avail => (
                                                            <label
                                                                key={avail.id}
                                                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${data.availability_id === avail.id
                                                                        ? 'border-sky-600 bg-sky-50 ring-1 ring-sky-600'
                                                                        : 'hover:bg-gray-50'
                                                                    } ${avail.available_spots < totalParticipants ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="availability_id"
                                                                    value={avail.id}
                                                                    checked={data.availability_id === avail.id}
                                                                    onChange={() => setData('availability_id', avail.id)}
                                                                    disabled={avail.available_spots < totalParticipants}
                                                                    className="sr-only"
                                                                />
                                                                <div className="flex items-center gap-2">
                                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                                    <span className="font-medium">{avail.start_time.slice(0, 5)}</span>
                                                                </div>
                                                                <Badge variant={avail.available_spots > 5 ? 'secondary' : 'destructive'} className="text-xs">
                                                                    {avail.available_spots} left
                                                                </Badge>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!selectedDate && (
                                                <p className="text-sm text-muted-foreground">
                                                    Please select a date above to see available times
                                                </p>
                                            )}

                                            {errors.availability_id && (
                                                <p className="text-sm text-red-600 mt-2">{errors.availability_id}</p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Step 2: Participants */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">2</span>
                                                Number of Participants
                                            </CardTitle>
                                            <CardDescription>
                                                Maximum {activity.max_group_size} people per booking
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Adults */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Adults</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatIDR(activity.price_idr)} per person
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => adjustParticipants('adults', -1)}
                                                        disabled={data.adults <= 1}
                                                        aria-label="Decrease adults"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center font-semibold text-lg">{data.adults}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => adjustParticipants('adults', 1)}
                                                        disabled={totalParticipants >= activity.max_group_size}
                                                        aria-label="Increase adults"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Children */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">Children</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatIDR(childPrice)} per child (Ages 4-12)
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => adjustParticipants('children', -1)}
                                                        disabled={data.children <= 0}
                                                        aria-label="Decrease children"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <span className="w-8 text-center font-semibold text-lg">{data.children}</span>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => adjustParticipants('children', 1)}
                                                        disabled={totalParticipants >= activity.max_group_size}
                                                        aria-label="Increase children"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {totalParticipants > activity.max_group_size && (
                                                <p className="text-sm text-red-600">
                                                    Maximum group size is {activity.max_group_size} people
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Step 3: Contact Info */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <span className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-sm font-bold">3</span>
                                                Contact Information
                                            </CardTitle>
                                            <CardDescription>
                                                We'll send your booking confirmation to this email
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="contact_name">Full Name *</Label>
                                                    <Input
                                                        id="contact_name"
                                                        value={data.contact_name}
                                                        onChange={(e) => setData('contact_name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                    {errors.contact_name && (
                                                        <p className="text-sm text-red-600">{errors.contact_name}</p>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="contact_phone">Phone Number *</Label>
                                                    <Input
                                                        id="contact_phone"
                                                        type="tel"
                                                        value={data.contact_phone}
                                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                                        placeholder="+62 xxx xxxx xxxx"
                                                        required
                                                    />
                                                    {errors.contact_phone && (
                                                        <p className="text-sm text-red-600">{errors.contact_phone}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact_email">Email Address *</Label>
                                                <Input
                                                    id="contact_email"
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={(e) => setData('contact_email', e.target.value)}
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                                {errors.contact_email && (
                                                    <p className="text-sm text-red-600">{errors.contact_email}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                                                <Textarea
                                                    id="special_requests"
                                                    value={data.special_requests}
                                                    onChange={(e) => setData('special_requests', e.target.value)}
                                                    placeholder="Dietary requirements, accessibility needs, or any other requests..."
                                                    rows={3}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar - Summary */}
                                <div className="lg:sticky lg:top-4 space-y-4 h-fit">
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <CardTitle className="text-lg">Booking Summary</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Activity Info */}
                                            <div className="flex gap-3">
                                                <img
                                                    src={activity.cover_image || '/images/placeholder.jpg'}
                                                    alt={activity.title}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold line-clamp-2 text-sm">{activity.title}</h3>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Rating value={activity.rating_average} count={activity.review_count} size="sm" />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {activity.area.name}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Selected Date/Time */}
                                            {selectedAvailability && (
                                                <div className="bg-sky-50 rounded-lg p-3">
                                                    <p className="text-sm font-medium text-sky-800">
                                                        {new Date(selectedAvailability.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'long',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                        })}
                                                    </p>
                                                    <p className="text-sm text-sky-600">
                                                        {selectedAvailability.start_time.slice(0, 5)} • {formatDuration(activity.duration_minutes)}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Price Breakdown */}
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span>Adults ({data.adults} × {formatIDR(activity.price_idr)})</span>
                                                    <span>{formatIDR(adultTotal)}</span>
                                                </div>
                                                {data.children > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Children ({data.children} × {formatIDR(childPrice)})</span>
                                                        <span>{formatIDR(childTotal)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Service fee (5%)</span>
                                                    <span>{formatIDR(serviceFee)}</span>
                                                </div>
                                                <Separator />
                                                <div className="flex justify-between font-bold text-lg pt-1">
                                                    <span>Total</span>
                                                    <span className="text-sky-600">{formatIDR(totalAmount)}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex-col gap-3">
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                size="lg"
                                                disabled={processing || !canSubmit}
                                            >
                                                {processing ? 'Processing...' : 'Continue to Payment'}
                                            </Button>
                                            <p className="text-xs text-center text-muted-foreground">
                                                You won't be charged until you complete payment
                                            </p>
                                        </CardFooter>
                                    </Card>

                                    {/* Trust Badges */}
                                    <Card className="bg-green-50 border-green-200">
                                        <CardContent className="py-4">
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Instant confirmation</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <Shield className="h-4 w-4" />
                                                    <span>Secure payment</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <Info className="h-4 w-4" />
                                                    <span>Free cancellation 24h before</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
