import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Waves, Mountain, Landmark, Utensils, Sparkles, Map, Ship, Sunset } from 'lucide-react';
import { cn, formatDuration, formatIDR, formatUSD } from '@/lib/utils';
import type { Activity } from '@/types';
import { useState } from 'react';

// Skeleton component for loading state
export function ActivityCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn('glass-card rounded-3xl overflow-hidden animate-pulse', className)}>
            <div className="h-64 ocean-gradient-1 opacity-50" />
            <div className="p-6 space-y-4">
                <div className="flex justify-between">
                    <div className="h-6 w-24 bg-white/20 rounded-full" />
                    <div className="h-6 w-12 bg-white/20 rounded" />
                </div>
                <div className="h-6 w-3/4 bg-white/20 rounded" />
                <div className="h-4 w-full bg-white/20 rounded" />
                <div className="h-4 w-2/3 bg-white/20 rounded" />
                <div className="h-12 w-full bg-white/30 rounded-xl" />
            </div>
        </div>
    );
}

interface ActivityCardProps {
    activity: Activity;
    variant?: 'default' | 'compact' | 'horizontal';
    showWishlist?: boolean;
    className?: string;
    animationDelay?: number;
}

// Map category to gradient, icon, and image
const categoryStyles: Record<string, { gradient: string; icon: React.ComponentType<any>; image: string }> = {
    'water-sports': { gradient: 'ocean-gradient-1', icon: Waves, image: '/images/bali/bali_surfing.png' },
    'water_sports': { gradient: 'ocean-gradient-1', icon: Waves, image: '/images/bali/bali_surfing.png' },
    'adventure': { gradient: 'ocean-gradient-2', icon: Mountain, image: '/images/bali/bali_waterfall.png' },
    'culture': { gradient: 'ocean-gradient-2', icon: Landmark, image: '/images/bali/bali_temple.png' },
    'food': { gradient: 'ocean-gradient-3', icon: Utensils, image: '/images/bali/bali_rice_terrace.png' },
    'wellness': { gradient: 'ocean-gradient-3', icon: Sparkles, image: '/images/bali/bali_rice_terrace.png' },
    'tours': { gradient: 'ocean-gradient-1', icon: Map, image: '/images/bali/bali_nusa_penida.png' },
    'island-hopping': { gradient: 'ocean-gradient-3', icon: Ship, image: '/images/bali/bali_nusa_penida.png' },
    'island_hopping': { gradient: 'ocean-gradient-3', icon: Ship, image: '/images/bali/bali_nusa_penida.png' },
    'sunset': { gradient: 'ocean-gradient-4', icon: Sunset, image: '/images/bali/bali_sunset.png' },
    'snorkeling': { gradient: 'ocean-gradient-1', icon: Waves, image: '/images/bali/bali_snorkeling.png' },
    'default': { gradient: 'ocean-gradient-1', icon: Waves, image: '/images/bali/bali_hero_beach.png' },
};

export function ActivityCard({
    activity,
    variant = 'default',
    showWishlist = true,
    className,
    animationDelay = 0,
}: ActivityCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Get category style - try both underscore and dash versions
    const categoryId = activity.category?.id?.toLowerCase() || 'default';
    const categorySlug = categoryId.replace(/_/g, '-');
    const style = categoryStyles[categoryId] || categoryStyles[categorySlug] || categoryStyles.default;
    const { gradient, icon: CategoryIcon, image: categoryImage } = style;

    // Convert IDR to approximate USD
    const priceUSD = activity.price_idr ? Math.round(activity.price_idr / 15000) : 0;

    if (variant === 'horizontal') {
        return (
            <Link to={`/activities/${activity.slug}`}>
                <div
                    className={cn(
                        'glass-card rounded-2xl overflow-hidden group animate-fade-in-up',
                        className
                    )}
                    style={{ animationDelay: `${animationDelay}s` }}
                >
                    <div className="flex">
                        {/* Image / Gradient */}
                        <div className="relative w-48 flex-shrink-0 overflow-hidden">
                            <img
                                src={activity.cover_image || categoryImage}
                                alt={activity.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className={cn('absolute inset-0 opacity-60', gradient)} />
                            <CategoryIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-white/50" />
                            {activity.is_featured && (
                                <span className="absolute top-2 left-2 glass px-3 py-1 rounded-full text-white text-xs font-medium">
                                    Featured
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <span className="glass px-3 py-1 rounded-full text-white text-xs font-medium">
                                            {activity.category?.name || 'Activity'}
                                        </span>
                                        <h3 className="font-bold text-lg text-white mt-2 group-hover:text-white/80 transition-colors">
                                            {activity.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-white font-semibold">{typeof activity.rating_average === 'number' ? activity.rating_average.toFixed(1) : (parseFloat(activity.rating_average as string) || 4.5).toFixed(1)}</span>
                                    </div>
                                </div>
                                <p className="text-white/70 text-sm line-clamp-2 mt-2">
                                    {activity.short_description || activity.description}
                                </p>
                            </div>

                            <div className="flex items-end justify-between mt-4">
                                <div className="flex items-center gap-4 text-white/60 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{formatDuration(activity.duration_minutes)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        <span>{activity.area?.name || 'Bali'}</span>
                                    </div>
                                </div>
                                <div className="price-badge px-4 py-2 rounded-full">
                                    <p className="text-black font-bold">${priceUSD} USD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    if (variant === 'compact') {
        return (
            <Link to={`/activities/${activity.slug}`}>
                <div
                    className={cn(
                        'glass-card rounded-2xl overflow-hidden group animate-scale-in',
                        className
                    )}
                    style={{ animationDelay: `${animationDelay}s` }}
                >
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                            src={activity.cover_image || categoryImage}
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={cn('absolute inset-0 opacity-40', gradient)} />
                        <CategoryIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-white/60" />
                    </div>
                    <div className="p-4">
                        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-white/80 transition-colors">
                            {activity.title}
                        </h3>
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-xs">{typeof activity.rating_average === 'number' ? activity.rating_average.toFixed(1) : (parseFloat(activity.rating_average as string) || 4.5).toFixed(1)}</span>
                            </div>
                            <span className="text-white font-bold text-sm">
                                ${priceUSD}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }

    // Default variant - Full glass card
    return (
        <Link to={`/activities/${activity.slug}`}>
            <div
                className={cn(
                    'glass-card rounded-3xl overflow-hidden group animate-fade-in-up',
                    className
                )}
                style={{ animationDelay: `${animationDelay}s` }}
            >
                {/* Image Background */}
                <div className="relative h-64 overflow-hidden">
                    <img
                        src={activity.cover_image || categoryImage}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Wishlist Button */}
                    {showWishlist && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setIsWishlisted(!isWishlisted);
                            }}
                            className="absolute top-4 right-4 w-10 h-10 glass-strong rounded-full flex items-center justify-center heart-icon transition-all hover:scale-110"
                        >
                            <Heart
                                className={cn(
                                    'w-5 h-5 transition-colors',
                                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-white'
                                )}
                            />
                        </button>
                    )}

                    {/* Price Badge */}
                    <div className="price-badge absolute bottom-4 left-4 px-4 py-2 rounded-full">
                        <p className="text-black font-bold">${priceUSD} USD</p>
                        <p className="text-black/70 text-xs">{formatIDR(activity.price_idr)}</p>
                    </div>

                    {/* Featured Badge */}
                    {activity.is_featured && (
                        <span className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-white text-xs font-medium">
                            Featured
                        </span>
                    )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="glass px-3 py-1 rounded-full text-white text-xs font-medium">
                            {activity.category?.name || 'Activity'}
                        </span>
                        <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white font-semibold">{typeof activity.rating_average === 'number' ? activity.rating_average.toFixed(1) : (parseFloat(activity.rating_average as string) || 4.8).toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-xl mb-2 group-hover:text-white/80 transition-colors line-clamp-1">
                        {activity.title}
                    </h3>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {activity.short_description || activity.description || 'Experience the best of Bali with this amazing activity'}
                    </p>

                    {/* Location */}
                    <div className="flex items-center text-white/60 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{activity.area?.name || 'Bali'}</span>
                    </div>

                    {/* Book Now Button */}
                    <button className="w-full btn-ocean py-3 rounded-xl text-white font-semibold transition-all">
                        Book Now
                    </button>
                </div>
            </div>
        </Link>
    );
}
