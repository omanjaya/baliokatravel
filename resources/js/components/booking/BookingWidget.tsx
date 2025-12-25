import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay, formatIDR } from '@/components/common/PriceDisplay';
import {
    Calendar as CalendarIcon,
    Plus,
    Minus,
    Users,
    Clock,
    MapPin,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Activity, Availability } from '@/types';

interface BookingWidgetProps {
    activity: Activity;
    availabilities?: Availability[];
    className?: string;
}

export function BookingWidget({
    activity,
    availabilities = [],
    className,
}: BookingWidgetProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string | undefined>();
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    const totalParticipants = adults + children;
    const childPrice = activity.child_price_idr || Math.round(activity.price_idr * 0.7);
    const subtotal = (adults * activity.price_idr) + (children * childPrice);
    const serviceFee = Math.round(subtotal * 0.05);
    const total = subtotal + serviceFee;

    // Get available times for selected date
    const availableSlots = selectedDate
        ? availabilities.filter(
            (a) => a.date === format(selectedDate, 'yyyy-MM-dd') && a.status === 'open'
        )
        : [];

    // Check if date has availability
    const hasAvailability = (date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return availabilities.some(
            (a) => a.date === dateStr && a.status === 'open' && a.available_spots > 0
        );
    };

    const handleBook = () => {
        if (!selectedDate || !selectedTime) return;

        router.get(`/book/${activity.slug}`, {
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTime,
            adults,
            children,
        });
    };

    const isValid = selectedDate && selectedTime && totalParticipants > 0;

    return (
        <Card className={cn('sticky top-20', className)}>
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-2xl text-sky-600">
                            {formatIDR(activity.price_idr)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">per person</p>
                    </div>
                    {activity.is_featured && (
                        <Badge className="bg-orange-500">Popular</Badge>
                    )}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Date Selection */}
                <div>
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    'w-full justify-start text-left font-normal h-12',
                                    !selectedDate && 'text-muted-foreground'
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, 'EEE, MMM d, yyyy') : 'Choose a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                    setSelectedTime(undefined);
                                }}
                                disabled={(date) => date < new Date() || !hasAvailability(date)}
                                modifiers={{
                                    available: (date) => hasAvailability(date),
                                }}
                                modifiersStyles={{
                                    available: {
                                        fontWeight: 'bold',
                                        backgroundColor: 'rgb(224 242 254)',
                                    },
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                    <div>
                        <label className="text-sm font-medium mb-2 block">Select Time</label>
                        {availableSlots.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedTime(slot.start_time)}
                                        className={cn(
                                            'p-3 rounded-lg border text-sm font-medium transition-colors',
                                            selectedTime === slot.start_time
                                                ? 'bg-sky-600 text-white border-sky-600'
                                                : 'bg-white hover:border-sky-600 hover:text-sky-600'
                                        )}
                                    >
                                        <div className="flex items-center justify-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {slot.start_time}
                                        </div>
                                        <div className="text-xs opacity-80 mt-1">
                                            {slot.available_spots} spots left
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm">No slots available for this date</span>
                            </div>
                        )}
                    </div>
                )}

                <Separator />

                {/* Participants */}
                <div className="space-y-3">
                    <label className="text-sm font-medium block">Participants</label>

                    {/* Adults */}
                    <div className="flex items-center justify-between">
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
                            <span className="w-8 text-center font-medium">{adults}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setAdults(Math.min(activity.max_group_size - children, adults + 1))}
                                disabled={totalParticipants >= activity.max_group_size}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
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
                            <span className="w-8 text-center font-medium">{children}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setChildren(Math.min(activity.max_group_size - adults, children + 1))}
                                disabled={totalParticipants >= activity.max_group_size}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Max {activity.max_group_size} participants per booking
                    </p>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">
                            {adults} × Adult ({formatIDR(activity.price_idr)})
                        </span>
                        <span>{formatIDR(adults * activity.price_idr)}</span>
                    </div>
                    {children > 0 && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {children} × Child ({formatIDR(childPrice)})
                            </span>
                            <span>{formatIDR(children * childPrice)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee (5%)</span>
                        <span>{formatIDR(serviceFee)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-sky-600">{formatIDR(total)}</span>
                    </div>
                </div>

                {/* Book Button */}
                <Button
                    onClick={handleBook}
                    disabled={!isValid}
                    className="w-full h-12 text-base bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700"
                >
                    {isValid ? 'Book Now' : 'Select date & time'}
                </Button>

                {/* Guarantees */}
                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Free cancellation up to 24h before</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Mobile voucher accepted</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
