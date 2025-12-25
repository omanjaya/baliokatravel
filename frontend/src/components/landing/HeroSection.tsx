import { SearchBox } from '@/components/search/SearchBox';
import { cn } from '@/lib/utils';
import type { BaliArea, Category } from '@/types';

interface HeroSectionProps {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
    areas?: BaliArea[];
    categories?: Category[];
    variant?: 'default' | 'compact' | 'minimal';
    className?: string;
}

export function HeroSection({
    title = 'Discover Paradise in Bali',
    subtitle = 'Experience unforgettable adventures across 13 stunning areas with 8 unique activity categories',
    showSearch = true,
    areas = [],
    categories = [],
    variant = 'default',
    className,
}: HeroSectionProps) {
    if (variant === 'minimal') {
        return (
            <section className={cn('py-8', className)}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    {subtitle && (
                        <p className="text-white/70 mt-1">{subtitle}</p>
                    )}
                </div>
            </section>
        );
    }

    if (variant === 'compact') {
        return (
            <section className={cn(
                'relative ocean-gradient-2 text-white py-12',
                className
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl font-bold">{title}</h1>
                        {subtitle && (
                            <p className="text-white/80 mt-2">{subtitle}</p>
                        )}
                    </div>
                    {showSearch && (
                        <div className="mt-6">
                            <SearchBox
                                areas={areas}
                                categories={categories}
                                variant="full"
                            />
                        </div>
                    )}
                </div>
            </section>
        );
    }

    // Default variant - Ocean Glassmorphism Hero with Bali Image
    return (
        <section className={cn(
            'relative min-h-[85vh] flex items-center justify-center overflow-hidden',
            className
        )}>
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/images/bali/bali_hero_beach.png"
                    alt="Bali Beach Paradise"
                    className="w-full h-full object-cover"
                />
                {/* Ocean gradient overlay for glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1b2a]/70 via-[#1b263b]/60 to-[#415a77]/70" />
            </div>

            {/* Floating Decoration Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 glass rounded-full animate-float opacity-30" />
            <div className="absolute bottom-20 right-10 w-24 h-24 glass rounded-full animate-float opacity-20 animation-delay-1500" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 glass rounded-full animate-float opacity-25 animation-delay-800" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                <div className="text-center mb-16">
                    {/* Main Title */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in-up">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in-up stagger-1">
                        {subtitle}
                    </p>

                    {/* Glassmorphic Search Widget */}
                    {showSearch && (
                        <div className="glass-ultra rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl animate-scale-in stagger-2">
                            <SearchBox
                                areas={areas}
                                categories={categories}
                                variant="hero"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
