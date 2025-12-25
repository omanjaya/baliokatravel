import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, CheckCircle2, Download } from 'lucide-react';
import { formatIDR, formatDuration } from '@/lib/utils';
import type { Booking } from '@/types';

interface Props {
    booking: Booking;
}

export default function Confirmation({ booking }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Booking Confirmed" />

            <div className="container py-8">
                <div className="max-w-3xl mx-auto">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="h-10 w-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                        <p className="text-muted-foreground">
                            Your adventure awaits. We've sent confirmation details to your email.
                        </p>
                    </div>

                    {/* Booking Reference */}
                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                        <p className="text-2xl font-bold text-sky-600">{booking.reference}</p>
                    </div>

                    {/* Booking Details */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-4">
                                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                        src={
                                            booking.activity.cover_image || '/images/placeholder.jpg'
                                        }
                                        alt={booking.activity.title}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <Badge className="mb-2" variant="secondary">
                                        {booking.status.toUpperCase()}
                                    </Badge>
                                    <h3 className="font-semibold text-lg mb-2">
                                        {booking.activity.title}
                                    </h3>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{booking.activity.area.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {formatDuration(booking.activity.duration_minutes)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>
                                                {new Date(
                                                    booking.availability?.date || ''
                                                ).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}{' '}
                                                at {booking.availability?.start_time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Participants</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Adults</span>
                                        <span className="font-medium">
                                            {booking.participants.adults}
                                        </span>
                                    </div>
                                    {booking.participants.children > 0 && (
                                        <div className="flex justify-between">
                                            <span>Children</span>
                                            <span className="font-medium">
                                                {booking.participants.children}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold text-xl">
                                    <span>Total Paid</span>
                                    <span className="text-sky-600">
                                        {formatIDR(booking.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Next Steps */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>What's Next?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-3 text-sm">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-xs">
                                        1
                                    </span>
                                    <span>
                                        Check your email for booking confirmation and voucher details
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-xs">
                                        2
                                    </span>
                                    <span>
                                        The activity provider will contact you 24 hours before your
                                        experience
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-xs">
                                        3
                                    </span>
                                    <span>
                                        Arrive at the meeting point 15 minutes before start time
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-semibold text-xs">
                                        4
                                    </span>
                                    <span>Enjoy your amazing Bali adventure!</span>
                                </li>
                            </ol>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Link href="/dashboard/bookings" className="flex-1">
                            <Button variant="outline" className="w-full">
                                View All Bookings
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button className="w-full">Browse More Activities</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
