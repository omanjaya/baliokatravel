import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageGallery } from '@/components/activity/ImageGallery';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { Rating, RatingStars } from '@/components/common/Rating';
import { ActivityCard } from '@/components/activity/ActivityCard';
// import { StaticMap } from '@/components/common/MapView';
import {
    Clock,
    Users,
    Star,
    MapPin,
    Globe,
    CheckCircle,
    XCircle,
    Calendar,
    Share2,
    Heart,
    Shield,
    Sparkles,
    Mountain
} from 'lucide-react';
import { formatIDR, formatDuration, cn } from '@/lib/utils';
import type { Activity, Availability, Review } from '@/types';

interface Props {
    activity: Activity;
    availabilities: Availability[];
    reviews: Review[];
    similarActivities?: Activity[];
}

const difficultyConfig = {
    easy: { label: 'Easy', color: 'bg-green-100 text-green-700', icon: Sparkles },
    moderate: { label: 'Moderate', color: 'bg-yellow-100 text-yellow-700', icon: Mountain },
    challenging: { label: 'Challenging', color: 'bg-red-100 text-red-700', icon: Mountain },
};

export default function Show({ activity, availabilities, reviews, similarActivities = [] }: Props) {
    const difficultyInfo = difficultyConfig[activity.difficulty] || difficultyConfig.moderate;
    const DifficultyIcon = difficultyInfo.icon;

    return (
        <GuestLayout>
            <Head title={`${activity.title} | BaliokaTravel`} />

            <div className="container py-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/search" className="hover:text-sky-600 transition-colors">Activities</Link>
                    <span>/</span>
                    <Link
                        href={`/search?area=${activity.area.id}`}
                        className="hover:text-sky-600 transition-colors"
                    >
                        {activity.area.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{activity.title}</span>
                </nav>

                {/* Image Gallery */}
                <ImageGallery
                    images={activity.images || [activity.cover_image || '/images/placeholder.jpg']}
                    title={activity.title}
                    videoUrl={activity.video_url}
                    className="mb-8"
                />

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="secondary" className="capitalize">
                                    {activity.category.name.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline">{activity.area.name}</Badge>
                                <Badge className={cn('gap-1', difficultyInfo.color)}>
                                    <DifficultyIcon className="h-3 w-3" />
                                    {difficultyInfo.label}
                                </Badge>
                                {activity.is_featured && (
                                    <Badge className="bg-orange-500">Featured</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{activity.title}</h1>

                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <Rating
                                    value={activity.rating_average}
                                    count={activity.review_count}
                                    size="md"
                                />
                                <Separator orientation="vertical" className="h-5" />
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4" />
                                    <span>{activity.area.name}</span>
                                </div>
                                <Separator orientation="vertical" className="h-5" />
                                <div className="flex items-center gap-1.5">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatDuration(activity.duration_minutes)}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-4">
                                <Button variant="outline" size="sm">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Heart className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <Clock className="h-6 w-6 mx-auto mb-2 text-sky-600" />
                                        <p className="font-semibold">{formatDuration(activity.duration_minutes)}</p>
                                        <p className="text-sm text-muted-foreground">Duration</p>
                                    </div>
                                    <div className="text-center">
                                        <Users className="h-6 w-6 mx-auto mb-2 text-sky-600" />
                                        <p className="font-semibold">Up to {activity.max_group_size}</p>
                                        <p className="text-sm text-muted-foreground">Group Size</p>
                                    </div>
                                    <div className="text-center">
                                        <Globe className="h-6 w-6 mx-auto mb-2 text-sky-600" />
                                        <p className="font-semibold">
                                            {activity.languages?.slice(0, 2).join(', ') || 'English'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Languages</p>
                                    </div>
                                    <div className="text-center">
                                        <Shield className="h-6 w-6 mx-auto mb-2 text-sky-600" />
                                        <p className="font-semibold">Free</p>
                                        <p className="text-sm text-muted-foreground">Cancellation</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tabs */}
                        <Tabs defaultValue="about">
                            <TabsList className="w-full justify-start">
                                <TabsTrigger value="about">About</TabsTrigger>
                                <TabsTrigger value="included">What's Included</TabsTrigger>
                                {/* <TabsTrigger value="location">Location</TabsTrigger> */}
                                <TabsTrigger value="reviews">Reviews ({activity.review_count})</TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="space-y-6 pt-4">
                                {/* Description */}
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">About this experience</h2>
                                    <div
                                        className="prose prose-gray max-w-none"
                                        dangerouslySetInnerHTML={{ __html: activity.description }}
                                    />
                                </div>

                                {/* Highlights */}
                                {activity.highlights && activity.highlights.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                                        <div className="grid md:grid-cols-2 gap-3">
                                            {activity.highlights.map((highlight, idx) => (
                                                <div key={idx} className="flex items-start gap-3 p-3 bg-sky-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                                                    <span>{highlight}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="included" className="space-y-6 pt-4">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Included */}
                                    {activity.included && activity.included.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-600">
                                                <CheckCircle className="h-5 w-5" />
                                                What's Included
                                            </h3>
                                            <ul className="space-y-3">
                                                {activity.included.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Excluded */}
                                    {activity.excluded && activity.excluded.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-600">
                                                <XCircle className="h-5 w-5" />
                                                Not Included
                                            </h3>
                                            <ul className="space-y-3">
                                                {activity.excluded.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-3">
                                                        <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            {/* Location tab temporarily disabled for debugging
                            <TabsContent value="location" className="pt-4">
                                ... location content ...
                            </TabsContent>
                            */}

                            <TabsContent value="reviews" className="pt-4">
                                {/* Review Summary */}
                                <Card className="mb-6">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-8">
                                            <div className="text-center">
                                                <div className="text-4xl font-bold text-sky-600">
                                                    {activity.rating_average.toFixed(1)}
                                                </div>
                                                <RatingStars value={activity.rating_average} size="md" className="mt-1" />
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    Based on {activity.review_count} reviews
                                                </p>
                                            </div>
                                            <Separator orientation="vertical" className="h-20" />
                                            <div className="flex-1">
                                                <p className="text-lg font-medium">Travelers love this experience!</p>
                                                <p className="text-muted-foreground">
                                                    Highly rated for service, value, and unique experiences.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Review List */}
                                <div className="space-y-4">
                                    {reviews.length > 0 ? (
                                        reviews.map((review) => (
                                            <Card key={review.id}>
                                                <CardContent className="p-5">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                                                <span className="font-semibold text-sky-600">
                                                                    {(review.user?.name || 'A').charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    {new Date(review.created_at).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <RatingStars value={review.rating} size="sm" />
                                                    </div>
                                                    <p className="text-muted-foreground">{review.content}</p>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-lg font-medium">No reviews yet</p>
                                            <p className="text-muted-foreground">
                                                Be the first to review this experience!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* Similar Activities */}
                        {similarActivities.length > 0 && (
                            <div className="pt-8 border-t">
                                <h2 className="text-2xl font-bold mb-6">Similar Experiences</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {similarActivities.slice(0, 4).map((similar) => (
                                        <ActivityCard
                                            key={similar.id}
                                            activity={similar}
                                            variant="compact"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Widget */}
                    <div>
                        <BookingWidget
                            activity={activity}
                            availabilities={availabilities}
                        />
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
