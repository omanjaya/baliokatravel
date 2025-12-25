import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Star, Calendar, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { activitiesApi } from '../api';
import type { Activity, BaliArea, Category } from '../types';

export function Home() {
    const [featuredActivities, setFeaturedActivities] = useState<Activity[]>([]);
    const [areas, setAreas] = useState<BaliArea[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [activitiesRes, areasRes, categoriesRes] = await Promise.all([
                    activitiesApi.getFeatured(6),
                    activitiesApi.getAreas(),
                    activitiesApi.getCategories(),
                ]);
                setFeaturedActivities(activitiesRes.data);
                setAreas(areasRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2000&q=80)',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                        Discover the Magic of{' '}
                        <span className="text-primary">Bali</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Unforgettable adventures await. From sacred temples to pristine beaches,
                        experience the best of Bali with our curated activities.
                    </p>
                    <Link to="/activities">
                        <Button size="lg" className="btn-ocean text-lg px-8">
                            Explore Activities
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Featured Activities */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex items-end justify-between mb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                Featured Activities
                            </h2>
                            <p className="text-white/60">
                                Handpicked experiences for unforgettable memories
                            </p>
                        </div>
                        <Link to="/activities">
                            <Button variant="ghost" className="text-primary hover:text-primary/80 group">
                                View All
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredActivities.map((activity) => (
                                <Link
                                    key={activity.id}
                                    to={`/activities/${activity.slug}`}
                                    className="glass-card rounded-2xl overflow-hidden group"
                                >
                                    <div className="aspect-[4/3] relative overflow-hidden">
                                        <img
                                            src={activity.cover_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'}
                                            alt={activity.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-white text-sm font-medium">
                                                {activity.rating_average?.toFixed(1) || '4.5'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>{activity.area?.name || 'Bali'}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {activity.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-white/60 text-sm">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDuration(activity.duration_minutes)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {activity.max_group_size}
                                                </span>
                                            </div>
                                            <span className="text-primary font-bold">
                                                {formatPrice(activity.price_idr)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Explore Areas */}
            <section className="py-16 md:py-24 glass">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Explore Bali's Best Areas
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            From the cultural heart of Ubud to the surf paradise of Canggu,
                            discover what makes each area unique.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {areas.slice(0, 8).map((area) => (
                            <Link
                                key={area.id}
                                to={`/activities?area=${area.id}`}
                                className="glass-card rounded-xl p-6 text-center group block"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                                    {area.image_url ? (
                                        <img
                                            src={area.image_url}
                                            alt={area.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <MapPin className="w-8 h-8 text-primary" />
                                    )}
                                </div>
                                <h3 className="text-white font-semibold group-hover:text-primary transition-colors">
                                    {area.name}
                                </h3>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/activities">
                            <Button variant="outline" size="lg">
                                View All Areas
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Activities by Category
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Whether you're seeking adventure, relaxation, or cultural experiences,
                            we have something for everyone.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/activities?category=${category.id}`}
                                className="glass-card rounded-xl overflow-hidden group block aspect-[4/3] relative"
                            >
                                {category.image_url && (
                                    <img
                                        src={category.image_url}
                                        alt={category.name}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-white font-semibold text-lg">
                                        {category.name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 md:py-24 glass">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                100+
                            </div>
                            <div className="text-white/60">Activities</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                13
                            </div>
                            <div className="text-white/60">Bali Areas</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                5000+
                            </div>
                            <div className="text-white/60">Happy Travelers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                                4.9
                            </div>
                            <div className="text-white/60">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="glass-card rounded-3xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Explore Bali?
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto mb-8">
                            Start planning your adventure today. Browse our curated collection
                            of activities and create memories that last a lifetime.
                        </p>
                        <Link to="/activities">
                            <Button size="lg" className="btn-ocean">
                                Browse All Activities
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
