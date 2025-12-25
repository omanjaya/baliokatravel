import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    ArrowLeft,
    Download,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { formatIDR, formatDuration } from '@/lib/utils';
import { Rating } from '@/components/common/Rating';
import type { Booking } from '@/types';
import { useState } from 'react';

interface Props {
    booking: Booking;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
    pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
    completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
};

export default function BookingShow({ booking }: Props) {
    const [cancelling, setCancelling] = useState(false);
    const status = statusConfig[booking.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        setCancelling(true);
        router.post(`/book/${booking.id}/cancel`, {}, {
            onFinish: () => setCancelling(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Booking ${booking.reference}`} />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container py-6">
                        <Link
                            href="/dashboard/bookings"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Bookings
                        </Link>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <Badge className={`${status.color} mb-2`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {status.label}
                                </Badge>
                                <h1 className="text-2xl lg:text-3xl font-bold">
                                    Booking {booking.reference}
                                </h1>
                            </div>
                            <div className="flex gap-2">
                                {booking.status === 'pending' && (
                                    <Link href={`/book/${booking.id}/payment`}>
                                        <Button>Complete Payment</Button>
                                    </Link>
                                )}
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={cancelling}
                                    >
                                        {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container py-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Activity Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        <img
                                            src={booking.activity.cover_image || '/images/placeholder.jpg'}
                                            alt={booking.activity.title}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <Link href={`/activities/${booking.activity.slug}`}>
                                                <h3 className="text-xl font-semibold hover:text-sky-600 transition">
                                                    {booking.activity.title}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Rating value={booking.activity.rating_average} size="sm" />
                                                {booking.activity.review_count > 0 && (
                                                    <span className="text-sm text-muted-foreground">
                                                        ({booking.activity.review_count} reviews)
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-3 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {booking.activity.area?.name || 'Bali'}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    {formatDuration(booking.activity.duration_minutes)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Booking Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Booking Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Calendar className="h-4 w-4" />
                                                <span className="text-sm">Date</span>
                                            </div>
                                            <p className="font-semibold">
                                                {booking.booking_date
                                                    ? new Date(booking.booking_date).toLocaleDateString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })
                                                    : 'To be determined'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-sm">Time</span>
                                            </div>
                                            <p className="font-semibold">
                                                {booking.booking_time || 'To be determined'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <Users className="h-4 w-4" />
                                                <span className="text-sm">Participants</span>
                                            </div>
                                            <p className="font-semibold">
                                                {booking.participants.adults} Adult{booking.participants.adults > 1 ? 's' : ''}
                                                {booking.participants.children > 0 && (
                                                    <>, {booking.participants.children} Child{booking.participants.children > 1 ? 'ren' : ''}</>
                                                )}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                                <MapPin className="h-4 w-4" />
                                                <span className="text-sm">Meeting Point</span>
                                            </div>
                                            <p className="font-semibold text-sm">
                                                {booking.activity.meeting_point || 'Check confirmation email'}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.special_requests && (
                                        <>
                                            <Separator />
                                            <div>
                                                <h4 className="font-medium mb-2">Special Requests</h4>
                                                <p className="text-muted-foreground">{booking.special_requests}</p>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Contact Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Users className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Name</p>
                                                <p className="font-medium">{booking.contact_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium">{booking.contact_email}</p>
                                            </div>
                                        </div>
                                        {booking.contact_phone && (
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <Phone className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Phone</p>
                                                    <p className="font-medium">{booking.contact_phone}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Payment Summary */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Payment Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>{formatIDR((booking.subtotal || booking.total_amount) - (booking.service_fee || 0))}</span>
                                    </div>
                                    {booking.service_fee > 0 && (
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Service Fee</span>
                                            <span>{formatIDR(booking.service_fee)}</span>
                                        </div>
                                    )}
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-sky-600">{formatIDR(booking.total_amount)}</span>
                                    </div>

                                    {booking.payment && (
                                        <div className="pt-3 border-t">
                                            <div className="flex items-center gap-2 text-sm">
                                                <CheckCircle className="h-4 w-4 text-green-600" />
                                                <span>Paid on {new Date(booking.payment.paid_at || booking.confirmed_at || '').toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6 space-y-3">
                                    <Button variant="outline" className="w-full" disabled>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Voucher
                                    </Button>
                                    {booking.status === 'completed' && (
                                        <Link href={`/activities/${booking.activity.slug}#reviews`} className="block">
                                            <Button className="w-full">
                                                Write a Review
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Need Help */}
                            <Card className="bg-sky-50 border-sky-200">
                                <CardContent className="pt-6">
                                    <h3 className="font-semibold mb-2">Need Help?</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Contact our support team for any questions about your booking.
                                    </p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
