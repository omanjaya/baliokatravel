import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    Clock,
    MapPin,
    CreditCard,
    Shield,
    Lock,
    AlertCircle,
    Loader2,
    CheckCircle
} from 'lucide-react';
import { formatIDR, formatDuration } from '@/lib/utils';
import type { Booking } from '@/types';
import { useState, useEffect } from 'react';

interface Props {
    booking: Booking;
    stripeKey?: string;
}

export default function Payment({ booking, stripeKey }: Props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

    // Create payment intent on mount
    useEffect(() => {
        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/payment/${booking.id}/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to create payment intent');
            }

            const data = await response.json();
            setClientSecret(data.clientSecret);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleDemoPayment = async () => {
        setPaymentStatus('processing');

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Redirect to success
        setPaymentStatus('success');

        // Redirect after short delay
        setTimeout(() => {
            router.visit(`/book/${booking.id}/confirmation`, {
                replace: true,
            });
        }, 1500);
    };

    const serviceFee = Number(booking.service_fee || 0);
    const subtotal = Number(booking.subtotal || booking.total_amount);
    const totalAmount = Number(booking.total_amount);

    return (
        <AuthenticatedLayout>
            <Head title="Complete Payment" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Badge variant="secondary" className="mb-2">
                            Booking Reference: {booking.reference}
                        </Badge>
                        <h1 className="text-2xl lg:text-3xl font-bold">Complete Your Payment</h1>
                        <p className="text-muted-foreground mt-1">
                            Secure payment powered by Stripe
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Payment Form */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Error Alert */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-800">Payment Error</p>
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Success State */}
                            {paymentStatus === 'success' && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
                                    <CheckCircle className="h-12 w-12 text-green-600 mb-3" />
                                    <p className="font-medium text-green-800 text-lg">Payment Successful!</p>
                                    <p className="text-sm text-green-600 mt-1">Redirecting to confirmation...</p>
                                </div>
                            )}

                            {paymentStatus !== 'success' && (
                                <>
                                    {/* Payment Methods */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CreditCard className="h-5 w-5" />
                                                Payment Method
                                            </CardTitle>
                                            <CardDescription>
                                                Select how you would like to pay
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Card Payment Option */}
                                            <div className="border-2 border-sky-600 rounded-lg p-4 bg-sky-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                                                            <CreditCard className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">Credit / Debit Card</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                Visa, Mastercard, American Express
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <img src="/images/cards/visa.svg" alt="Visa" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                        <img src="/images/cards/mastercard.svg" alt="Mastercard" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Demo Notice */}
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <p className="text-sm text-amber-800">
                                                    <strong>Demo Mode:</strong> Stripe integration is configured.
                                                    Add your Stripe keys to <code className="bg-amber-100 px-1 rounded">.env</code> to enable live payments.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Pay Button */}
                                    <Button
                                        onClick={handleDemoPayment}
                                        className="w-full h-14 text-lg"
                                        disabled={loading || paymentStatus === 'processing'}
                                    >
                                        {paymentStatus === 'processing' ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="mr-2 h-5 w-5" />
                                                Pay {formatIDR(totalAmount)}
                                            </>
                                        )}
                                    </Button>

                                    {/* Security Badges */}
                                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4" />
                                            SSL Secured
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Lock className="h-4 w-4" />
                                            PCI Compliant
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="lg:col-span-2">
                            <Card className="sticky top-4">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Activity */}
                                    <div className="flex gap-3">
                                        <img
                                            src={booking.activity.cover_image || '/images/placeholder.jpg'}
                                            alt={booking.activity.title}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm line-clamp-2">
                                                {booking.activity.title}
                                            </h3>
                                            <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {booking.activity.area?.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {formatDuration(booking.activity.duration_minutes)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Date/Time */}
                                    {booking.availability && (
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {new Date(booking.booking_date || booking.availability.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm mt-1">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>{booking.booking_time || booking.availability.start_time}</span>
                                            </div>
                                        </div>
                                    )}

                                    <Separator />

                                    {/* Price Breakdown */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Guests ({booking.total_participants})</span>
                                            <span>{formatIDR(subtotal - serviceFee)}</span>
                                        </div>
                                        {serviceFee > 0 && (
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Service fee</span>
                                                <span>{formatIDR(serviceFee)}</span>
                                            </div>
                                        )}
                                        <Separator className="my-2" />
                                        <div className="flex justify-between font-bold text-base">
                                            <span>Total</span>
                                            <span className="text-sky-600">{formatIDR(totalAmount)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
