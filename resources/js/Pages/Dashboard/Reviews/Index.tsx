import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    ArrowLeft,
    MapPin,
    Calendar,
    ThumbsUp,
    MessageSquare
} from 'lucide-react';
import type { Activity, Review } from '@/types';

interface ReviewWithActivity extends Review {
    activity: Activity;
}

interface Props {
    reviews: {
        data: ReviewWithActivity[];
        current_page: number;
        last_page: number;
    };
}

export default function ReviewsIndex({ reviews }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="My Reviews" />

            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b">
                    <div className="container py-6">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                        <h1 className="text-2xl lg:text-3xl font-bold">My Reviews</h1>
                        <p className="text-muted-foreground mt-1">
                            Reviews you've written for activities
                        </p>
                    </div>
                </div>

                <div className="container py-8">
                    {reviews.data.length === 0 ? (
                        <Card>
                            <CardContent className="py-16 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    Complete an activity to write your first review
                                </p>
                                <Link href="/dashboard/bookings">
                                    <Button>View My Bookings</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {reviews.data.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Activity Image */}
                                            <Link href={`/activities/${review.activity.slug}`}>
                                                <img
                                                    src={review.activity.cover_image || '/images/placeholder.jpg'}
                                                    alt={review.activity.title}
                                                    className="w-full sm:w-32 h-32 object-cover rounded-lg"
                                                />
                                            </Link>

                                            <div className="flex-1">
                                                {/* Activity Title */}
                                                <Link href={`/activities/${review.activity.slug}`}>
                                                    <h3 className="font-semibold text-lg hover:text-sky-600 transition">
                                                        {review.activity.title}
                                                    </h3>
                                                </Link>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    {review.activity.area?.name || 'Bali'}
                                                </div>

                                                {/* Rating & Date */}
                                                <div className="flex items-center gap-4 mt-3">
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${star <= review.rating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-gray-300'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {formatDate(review.created_at)}
                                                    </div>
                                                    {review.helpful_count > 0 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <ThumbsUp className="h-3 w-3 mr-1" />
                                                            {review.helpful_count} helpful
                                                        </Badge>
                                                    )}
                                                </div>

                                                {/* Review Content */}
                                                <p className="text-muted-foreground mt-3 line-clamp-3">
                                                    {review.content}
                                                </p>

                                                {/* Supplier Response */}
                                                {review.supplier_response && (
                                                    <div className="mt-3 p-3 bg-sky-50 rounded-lg border border-sky-100">
                                                        <p className="text-xs font-medium text-sky-700 mb-1">
                                                            Supplier Response
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {review.supplier_response}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {reviews.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: reviews.last_page }, (_, i) => (
                                <Link
                                    key={i + 1}
                                    href={`/dashboard/reviews?page=${i + 1}`}
                                    className={`px-4 py-2 rounded ${reviews.current_page === i + 1
                                            ? 'bg-sky-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    {i + 1}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
