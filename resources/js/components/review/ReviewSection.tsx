import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Star,
    ThumbsUp,
    ChevronDown,
    MessageSquare,
    CheckCircle,
    User
} from 'lucide-react';
import type { Review, Activity } from '@/types';

interface ReviewStats {
    total: number;
    average: number;
    distribution: Record<number, number>;
    percentages: Record<number, number>;
}

interface Props {
    activity: Activity;
    reviews: Review[];
    stats: ReviewStats;
    canReview: boolean;
}

export function ReviewSection({ activity, reviews, stats, canReview }: Props) {
    const [visibleCount, setVisibleCount] = useState(5);
    const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleHelpful = async (reviewId: string) => {
        if (helpfulClicked.has(reviewId)) return;

        try {
            await fetch(`/reviews/${reviewId}/helpful`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            setHelpfulClicked(prev => new Set([...prev, reviewId]));
        } catch (error) {
            console.error('Failed to mark as helpful', error);
        }
    };

    return (
        <div className="space-y-6" id="reviews">
            {/* Reviews Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Reviews</h2>
                {canReview && (
                    <Link href={`/activities/${activity.id}/reviews/create`}>
                        <Button>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Write a Review
                        </Button>
                    </Link>
                )}
            </div>

            {/* Rating Summary */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Average Rating */}
                        <div className="text-center md:text-left">
                            <div className="text-5xl font-bold">{stats.average.toFixed(1)}</div>
                            <div className="flex justify-center md:justify-start gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.round(stats.average)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                {stats.total} {stats.total === 1 ? 'review' : 'reviews'}
                            </p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex-1 space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="w-8 text-sm text-right">{rating}</span>
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <Progress
                                        value={stats.percentages[rating]}
                                        className="flex-1 h-2"
                                    />
                                    <span className="w-10 text-sm text-muted-foreground">
                                        {stats.distribution[rating]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reviews List */}
            {reviews.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reviews.slice(0, visibleCount).map((review) => (
                        <Card key={review.id}>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-gray-500" />
                                    </div>

                                    <div className="flex-1">
                                        {/* Header */}
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                                            {review.booking_id && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                    Verified
                                                </Badge>
                                            )}
                                            <span className="text-sm text-muted-foreground">
                                                {formatDate(review.created_at)}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1 mt-1">
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

                                        {/* Title */}
                                        {review.title && (
                                            <h4 className="font-medium mt-2">{review.title}</h4>
                                        )}

                                        {/* Content */}
                                        <p className="text-muted-foreground mt-2">{review.content}</p>

                                        {/* Photos */}
                                        {review.photos && review.photos.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {review.photos.map((photo, index) => (
                                                    <img
                                                        key={index}
                                                        src={photo}
                                                        alt={`Review photo ${index + 1}`}
                                                        className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Helpful Button */}
                                        <div className="mt-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleHelpful(review.id)}
                                                disabled={helpfulClicked.has(review.id)}
                                                className={helpfulClicked.has(review.id) ? 'text-sky-600' : ''}
                                            >
                                                <ThumbsUp className={`h-4 w-4 mr-1 ${helpfulClicked.has(review.id) ? 'fill-current' : ''}`} />
                                                Helpful ({(review.helpful_count || 0) + (helpfulClicked.has(review.id) ? 1 : 0)})
                                            </Button>
                                        </div>

                                        {/* Supplier Response */}
                                        {review.supplier_response && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                                <p className="text-sm font-medium mb-1">Response from the host</p>
                                                <p className="text-sm text-muted-foreground">{review.supplier_response}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Load More */}
                    {reviews.length > visibleCount && (
                        <div className="text-center">
                            <Button
                                variant="outline"
                                onClick={() => setVisibleCount(prev => prev + 5)}
                            >
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Show More Reviews ({reviews.length - visibleCount} more)
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
