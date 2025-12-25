import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HeroSection } from '@/components/landing/HeroSection';
import { ActivityGrid } from '@/components/activity/ActivityGrid';
import { MapPin, Compass, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activity, BaliArea, Category } from '@/types';

interface Props {
    area: BaliArea;
    activities: {
        data: Activity[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
}

export default function Show({ area, activities, categories = [] }: Props) {
    const handlePageChange = (page: number) => {
        router.get(`/areas/${area.id}`, { page }, { preserveScroll: true });
    };

    return (
        <GuestLayout>
            <Head title={`Activities in ${area.name} | BaliokaTravel`} />

            {/* Hero Section with Area Image */}
            <section className="relative min-h-[400px] flex items-end overflow-hidden">
                {/* Background */}
                {area.image_url ? (
                    <>
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${area.image_url})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-600 to-blue-700" />
                )}

                {/* Content */}
                <div className="container relative py-16 text-white">
                    {/* Back Link */}
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Search
                    </Link>

                    <div className="max-w-3xl">
                        <div className="flex items-center gap-2 text-white/80 mb-3">
                            <MapPin className="h-5 w-5" />
                            <span>Bali, Indonesia</span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
                            {area.name}
                        </h1>

                        {area.description && (
                            <p className="text-lg lg:text-xl text-white/90 mb-6 max-w-2xl">
                                {area.description}
                            </p>
                        )}

                        {area.popular_for && area.popular_for.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <span className="text-white/70 mr-2">Popular for:</span>
                                {area.popular_for.map((item) => (
                                    <Badge
                                        key={item}
                                        variant="secondary"
                                        className="bg-white/20 text-white border-0 backdrop-blur capitalize"
                                    >
                                        {item.replace('_', ' ')}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Activities Section */}
            <div className="container py-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl lg:text-3xl font-bold">
                            {activities.total} {activities.total === 1 ? 'Activity' : 'Activities'} in {area.name}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            Discover the best experiences in this area
                        </p>
                    </div>

                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-sky-50 hover:border-sky-500"
                            >
                                All
                            </Badge>
                            {categories.slice(0, 5).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/search?area=${area.id}&category=${category.id}`}
                                >
                                    <Badge
                                        variant="outline"
                                        className="cursor-pointer hover:bg-sky-50 hover:border-sky-500 capitalize"
                                    >
                                        {category.name.replace('_', ' ')}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Activity Grid */}
                <ActivityGrid
                    activities={activities.data}
                    columns={3}
                    emptyMessage={`No activities found in ${area.name} yet. Check back soon!`}
                />

                {/* Pagination */}
                {activities.last_page > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={activities.current_page === 1}
                            onClick={() => handlePageChange(activities.current_page - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, activities.last_page) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <Button
                                        key={page}
                                        variant={page === activities.current_page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        className="w-10"
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                            {activities.last_page > 5 && (
                                <>
                                    <span className="text-muted-foreground">...</span>
                                    <Button
                                        variant={activities.current_page === activities.last_page ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => handlePageChange(activities.last_page)}
                                        className="w-10"
                                    >
                                        {activities.last_page}
                                    </Button>
                                </>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={activities.current_page === activities.last_page}
                            onClick={() => handlePageChange(activities.current_page + 1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Explore More */}
                <div className="mt-16 text-center">
                    <h3 className="text-xl font-bold mb-3">Want to explore more of Bali?</h3>
                    <p className="text-muted-foreground mb-6">
                        Discover activities in other amazing areas across the island
                    </p>
                    <Link href="/search">
                        <Button variant="outline" size="lg">
                            <Compass className="h-5 w-5 mr-2" />
                            Browse All Activities
                        </Button>
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
