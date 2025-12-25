import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, MapPin, Star, Check, X, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { activitiesApi } from '../api';
import type { Activity, Availability, Review } from '../types';

export function ActivityDetail() {
    const { slug } = useParams<{ slug: string }>();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [availability, setAvailability] = useState<Availability[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!slug) return;

            setIsLoading(true);
            setError(null);

            try {
                const [activityRes, availabilityRes, reviewsRes] = await Promise.all([
                    activitiesApi.getBySlug(slug),
                    activitiesApi.getAvailability(slug),
                    activitiesApi.getReviews(slug),
                ]);

                setActivity(activityRes.data);
                setAvailability(availabilityRes.data);
                setReviews(reviewsRes.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load activity');
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, [slug]);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours} hr`;
        return `${hours} hr ${mins} min`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse">
                    <div className="h-8 w-48 bg-white/10 rounded mb-4" />
                    <div className="h-96 bg-white/10 rounded-2xl mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="h-10 w-3/4 bg-white/10 rounded" />
                            <div className="h-20 bg-white/10 rounded" />
                        </div>
                        <div className="h-80 bg-white/10 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !activity) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="glass-card rounded-2xl p-12 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Activity Not Found</h2>
                    <p className="text-white/60 mb-6">{error || 'The activity you are looking for does not exist.'}</p>
                    <Link to="/activities">
                        <Button>Browse Activities</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const totalPrice = (adults * activity.price_idr) + (children * (activity.child_price_idr || activity.price_idr * 0.7));

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link
                        to="/activities"
                        className="inline-flex items-center text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </Link>
                </div>

                {/* Image Gallery */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8">
                    <div className="col-span-2 row-span-2 relative">
                        <img
                            src={activity.cover_image || activity.images?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {activity.images?.slice(0, 4).map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`${activity.title} - ${index + 2}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="secondary">{activity.category?.name}</Badge>
                                <Badge variant="outline">{activity.area?.name}</Badge>
                                {activity.instant_booking && (
                                    <Badge className="bg-green-500/20 text-green-400">Instant Booking</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {activity.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-white/60">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold text-white">{activity.rating_average?.toFixed(1)}</span>
                                    <span>({activity.review_count} reviews)</span>
                                </div>

                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {formatDuration(activity.duration_minutes)}
                                </span>

                                <span className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Up to {activity.max_group_size} guests
                                </span>

                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {activity.area?.name}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">About this activity</h2>
                            <p className="text-white/80 whitespace-pre-line">{activity.description}</p>
                        </div>

                        {/* Highlights */}
                        {activity.highlights && activity.highlights.length > 0 && (
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">Highlights</h2>
                                <ul className="space-y-3">
                                    {activity.highlights.map((highlight, index) => (
                                        <li key={index} className="flex items-start gap-3 text-white/80">
                                            <Star className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* What's Included */}
                        <div className="glass-card rounded-2xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">What's Included</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {activity.included && activity.included.length > 0 && (
                                    <div>
                                        <h3 className="text-white font-semibold mb-3">Included</h3>
                                        <ul className="space-y-2">
                                            {activity.included.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2 text-white/80">
                                                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-1" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {activity.excluded && activity.excluded.length > 0 && (
                                    <div>
                                        <h3 className="text-white font-semibold mb-3">Not Included</h3>
                                        <ul className="space-y-2">
                                            {activity.excluded.map((item, index) => (
                                                <li key={index} className="flex items-start gap-2 text-white/60">
                                                    <X className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div className="glass-card rounded-2xl p-6">
                                <h2 className="text-xl font-semibold text-white mb-4">
                                    Reviews ({activity.review_count})
                                </h2>
                                <div className="space-y-4">
                                    {reviews.slice(0, 5).map((review) => (
                                        <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                                    {review.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{review.user?.name || 'Anonymous'}</div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/20'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-white/70 text-sm">{review.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Widget - Sticky Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-2xl p-6 sticky top-24">
                            <div className="flex items-baseline justify-between mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-white">{formatPrice(activity.price_idr)}</span>
                                    <span className="text-white/60"> / person</span>
                                </div>
                            </div>

                            {/* Participants */}
                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-white">Adults</span>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setAdults(Math.max(1, adults - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="text-white w-8 text-center">{adults}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setAdults(Math.min(activity.max_group_size, adults + 1))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-white">Children</span>
                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setChildren(Math.max(0, children - 1))}
                                        >
                                            -
                                        </Button>
                                        <span className="text-white w-8 text-center">{children}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => setChildren(children + 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-white/10 pt-4 mb-6 space-y-2">
                                <div className="flex justify-between text-white/60">
                                    <span>{adults} adults x {formatPrice(activity.price_idr)}</span>
                                    <span>{formatPrice(adults * activity.price_idr)}</span>
                                </div>
                                {children > 0 && (
                                    <div className="flex justify-between text-white/60">
                                        <span>{children} children</span>
                                        <span>{formatPrice(children * (activity.child_price_idr || activity.price_idr * 0.7))}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-white font-semibold text-lg pt-2 border-t border-white/10">
                                    <span>Total</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            <Button className="w-full btn-ocean" size="lg">
                                Book Now
                            </Button>

                            <p className="text-white/40 text-xs text-center mt-4">
                                Free cancellation up to 24 hours before
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActivityDetail;
