import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { HeroSection } from '@/components/landing/HeroSection';
import { ActivityCard } from '@/components/activity/ActivityCard';
import { ScrollReveal, ScrollRevealGroup } from '@/components/common/ScrollReveal';
import {
    ArrowRight,
    Waves,
    Mountain,
    Utensils,
    Sparkles,
    Landmark,
    Map,
    Ship,
    Sunset,
    ShieldCheck,
    Star,
    Users,
    Headphones,
    Search,
    Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity, BaliArea, Category } from '@/types';


interface Props {
    featuredActivities: Activity[];
    areas: BaliArea[];
    categories: Category[];
}

const categoryConfig: Record<string, { icon: React.ComponentType<any>; gradient: string }> = {
    water_sports: { icon: Waves, gradient: 'ocean-gradient-3' },
    adventure: { icon: Mountain, gradient: 'ocean-gradient-1' },
    culture: { icon: Landmark, gradient: 'ocean-gradient-2' },
    food: { icon: Utensils, gradient: 'ocean-gradient-4' },
    wellness: { icon: Sparkles, gradient: 'ocean-gradient-3' },
    tours: { icon: Map, gradient: 'ocean-gradient-1' },
    island_hopping: { icon: Ship, gradient: 'ocean-gradient-2' },
    sunset: { icon: Sunset, gradient: 'ocean-gradient-4' },
};

export default function Home({ featuredActivities, areas, categories }: Props) {
    return (
        <GuestLayout>
            <Head title="Discover Amazing Bali Adventures | BaliokaTravel" />

            {/* Hero Section */}
            <HeroSection
                title="Discover Paradise in Bali"
                subtitle="Experience unforgettable adventures across 13 stunning areas with 8 unique activity categories"
                areas={areas}
                categories={categories}
                showSearch={true}
            />

            {/* Trust Badges */}
            <section className="py-16 bg-gradient-to-b from-transparent to-[#0d1b2a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollRevealGroup
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                        animation="zoom-in"
                        staggerDelay={150}
                    >
                        <div className="glass-card rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 ocean-gradient-3 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-2">100%</h3>
                            <p className="text-white/80 text-sm">Secure Booking</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 ocean-gradient-2 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-2">4.9/5</h3>
                            <p className="text-white/80 text-sm">Customer Rating</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 ocean-gradient-1 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-2">50K+</h3>
                            <p className="text-white/80 text-sm">Happy Travelers</p>
                        </div>

                        <div className="glass-card rounded-2xl p-6 text-center">
                            <div className="w-16 h-16 ocean-gradient-4 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Headphones className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-white font-bold text-2xl mb-2">24/7</h3>
                            <p className="text-white/80 text-sm">Support</p>
                        </div>
                    </ScrollRevealGroup>
                </div>
            </section>

            {/* Featured Activities */}
            <section className="py-24 bg-[#0d1b2a]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollReveal animation="fade-up" className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Featured Activities
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Handpicked experiences that showcase the best of Bali
                        </p>
                    </ScrollReveal>

                    {/* Activity Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(featuredActivities || []).slice(0, 8).map((activity, index) => (
                            <ActivityCard
                                key={activity.id}
                                activity={activity}
                                animationDelay={0.2 + index * 0.1}
                            />
                        ))}
                    </div>

                    {/* View All Link */}
                    <div className="text-center mt-12">
                        <Link href="/search">
                            <button className="btn-glass px-8 py-4 rounded-2xl text-white font-semibold inline-flex items-center gap-3">
                                View All Activities
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-24 bg-gradient-to-b from-[#0d1b2a] to-[#1b263b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollReveal animation="fade-up" className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Explore by Category
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Find your perfect adventure from our 8 exciting categories
                        </p>
                    </ScrollReveal>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {(categories || []).slice(0, 8).map((category, index) => {
                            const config = categoryConfig[category.id] || { icon: Sparkles, gradient: 'ocean-gradient-1' };
                            const Icon = config.icon;

                            return (
                                <Link key={category.id} href={`/search?category=${category.id}`}>
                                    <div
                                        className="glass-card category-card rounded-2xl p-8 text-center cursor-pointer animate-scale-in"
                                        style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                                    >
                                        <div className={cn(
                                            'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4',
                                            config.gradient
                                        )}>
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-2 capitalize">
                                            {category.name?.replace(/_/g, ' ') || 'Category'}
                                        </h3>
                                        <p className="text-white/70 text-sm">
                                            Explore activities
                                        </p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Destinations Section */}
            <section className="py-24 bg-[#1b263b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <ScrollReveal animation="fade-up" className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Popular Destinations
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">
                            Explore 13 stunning areas across the Island of Gods
                        </p>
                    </ScrollReveal>

                    {/* Areas Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {(areas || []).slice(0, 8).map((area, index) => (
                            <Link key={area.id} href={`/areas/${area.id}`}>
                                <div
                                    className="glass-card rounded-2xl p-6 text-center cursor-pointer group animate-scale-in"
                                    style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                                >
                                    <div className="w-16 h-16 ocean-gradient-3 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Map className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-lg mb-1">{area.name}</h3>
                                    <p className="text-white/60 text-sm">Explore area</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-[#1b263b] relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-10 left-10 w-40 h-40 glass rounded-full animate-float opacity-20" />
                <div className="absolute bottom-10 right-10 w-32 h-32 glass rounded-full animate-float opacity-15 animation-delay-1500" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <ScrollReveal animation="zoom-in">
                        <div className="glass-ultra rounded-3xl p-12">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                                Ready for Your Bali Adventure?
                            </h2>
                            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                Join thousands of travelers who have discovered paradise with BaliokaTravel
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/search">
                                    <button className="btn-ocean px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3">
                                        <Search className="w-6 h-6" />
                                        <span>Explore Activities</span>
                                    </button>
                                </Link>
                                <button className="btn-glass px-8 py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3">
                                    <Phone className="w-6 h-6" />
                                    <span>Contact Us</span>
                                </button>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>

            </section>
        </GuestLayout>
    );
}
