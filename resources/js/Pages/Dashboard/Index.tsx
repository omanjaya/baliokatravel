import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle2, Clock, MapPin, Package } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import type { Booking } from '@/types';

interface Props {
    recentBookings: Booking[];
    stats: {
        total_bookings: number;
        upcoming_bookings: number;
        completed_bookings: number;
    };
}

export default function Index({ recentBookings, stats }: Props) {
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
            <Head title="Dashboard" />

            <div className="container py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                    <p className="text-muted-foreground">
                        Manage your bookings and explore new adventures in Bali
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_bookings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.upcoming_bookings}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completed_bookings}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Bookings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Bookings</CardTitle>
                            <Link href="/dashboard/bookings">
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {recentBookings.length > 0 ? (
                            <div className="space-y-4">
                                {recentBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
                                    >
                                        <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0">
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
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold truncate">
                                                        {booking.activity.title}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {booking.reference}
                                                    </p>
                                                </div>
                                                <Badge className={getStatusColor(booking.status)}>
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{booking.activity.area.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {new Date(
                                                            booking.created_at
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <span className="font-semibold text-sky-600">
                                                    {formatIDR(booking.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground mb-4">No bookings yet</p>
                                <Link href="/">
                                    <Button>Explore Activities</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
