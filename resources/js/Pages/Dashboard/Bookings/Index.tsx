import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Eye } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import type { Booking } from '@/types';

interface Props {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ bookings }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'completed':
                return 'bg-blue-100 text-blue-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Bookings" />

            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                    <p className="text-muted-foreground">
                        {bookings.total} total {bookings.total === 1 ? 'booking' : 'bookings'}
                    </p>
                </div>

                {bookings.data.length > 0 ? (
                    <>
                        <div className="space-y-4 mb-8">
                            {bookings.data.map((booking) => (
                                <Card key={booking.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={
                                                        booking.activity.cover_image ||
                                                        '/images/placeholder.jpg'
                                                    }
                                                    alt={booking.activity.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg mb-1 truncate">
                                                            {booking.activity.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Booking Ref: {booking.reference}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(booking.status)}>
                                                        {booking.status.toUpperCase()}
                                                    </Badge>
                                                </div>

                                                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{booking.activity.area.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            Booked on{' '}
                                                            {new Date(
                                                                booking.created_at
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Clock className="h-4 w-4" />
                                                        <span>
                                                            {booking.participants.adults} adult
                                                            {booking.participants.adults > 1 ? 's' : ''}
                                                            {booking.participants.children > 0 &&
                                                                `, ${booking.participants.children} child${booking.participants.children > 1 ? 'ren' : ''}`}
                                                        </span>
                                                    </div>
                                                    <div className="font-semibold text-sky-600">
                                                        {formatIDR(booking.total_amount)}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/book/${booking.id}/confirmation`}
                                                        className="inline-flex"
                                                    >
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pagination */}
                        {bookings.last_page > 1 && (
                            <div className="flex justify-center gap-2">
                                {Array.from({ length: bookings.last_page }, (_, i) => i + 1).map(
                                    (page) => (
                                        <Link
                                            key={page}
                                            href={`/dashboard/bookings?page=${page}`}
                                            className={`px-4 py-2 rounded ${
                                                page === bookings.current_page
                                                    ? 'bg-sky-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
                            <p className="text-muted-foreground mb-6">
                                Start exploring amazing activities in Bali
                            </p>
                            <Link href="/">
                                <Button>Browse Activities</Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
