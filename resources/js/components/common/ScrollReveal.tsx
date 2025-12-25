import React, { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'flip';
    delay?: number;
    duration?: number;
    threshold?: number;
    once?: boolean;
}

/**
 * Wrapper component that animates children when scrolled into view
 */
export function ScrollReveal({
    children,
    className,
    animation = 'fade-up',
    delay = 0,
    duration = 600,
    threshold = 0.1,
    once = true,
}: ScrollRevealProps) {
    const [ref, isVisible] = useScrollAnimation<HTMLDivElement>({
        threshold,
        triggerOnce: once,
    });

    const animationClasses: Record<string, string> = {
        'fade-up': 'translate-y-8 opacity-0',
        'fade-down': '-translate-y-8 opacity-0',
        'fade-left': 'translate-x-8 opacity-0',
        'fade-right': '-translate-x-8 opacity-0',
        'zoom-in': 'scale-90 opacity-0',
        'flip': 'rotateX-90 opacity-0',
    };

    const visibleClasses = 'translate-y-0 translate-x-0 scale-100 rotateX-0 opacity-100';

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all ease-out',
                isVisible ? visibleClasses : animationClasses[animation],
                className
            )}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

interface ScrollRevealGroupProps {
    children: ReactNode[];
    className?: string;
    itemClassName?: string;
    animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in';
    staggerDelay?: number;
    duration?: number;
    threshold?: number;
}

/**
 * Wrapper for multiple items with staggered scroll animations
 */
export function ScrollRevealGroup({
    children,
    className,
    itemClassName,
    animation = 'fade-up',
    staggerDelay = 100,
    duration = 600,
    threshold = 0.1,
}: ScrollRevealGroupProps) {
    const [containerRef, isContainerVisible] = useScrollAnimation<HTMLDivElement>({
        threshold,
        rootMargin: '50px',
        triggerOnce: true,
    });

    const animationClasses: Record<string, string> = {
        'fade-up': 'translate-y-8 opacity-0',
        'fade-down': '-translate-y-8 opacity-0',
        'fade-left': 'translate-x-8 opacity-0',
        'fade-right': '-translate-x-8 opacity-0',
        'zoom-in': 'scale-90 opacity-0',
    };

    const visibleClasses = 'translate-y-0 translate-x-0 scale-100 opacity-100';

    return (
        <div ref={containerRef} className={className}>
            {React.Children.map(children, (child, index) => (
                <div
                    className={cn(
                        'transition-all ease-out',
                        isContainerVisible ? visibleClasses : animationClasses[animation],
                        itemClassName
                    )}
                    style={{
                        transitionDuration: `${duration}ms`,
                        transitionDelay: isContainerVisible ? `${index * staggerDelay}ms` : '0ms',
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

/**
 * Parallax effect on scroll
 */
interface ParallaxProps {
    children: ReactNode;
    speed?: number; // 0 = no effect, 1 = full parallax
    className?: string;
}

export function Parallax({ children, speed = 0.5, className }: ParallaxProps) {
    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);
    const [offset, setOffset] = React.useState(0);

    React.useEffect(() => {
        if (!ref) return;

        const handleScroll = () => {
            const rect = ref.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const distanceFromCenter = elementCenter - windowHeight / 2;
            setOffset(distanceFromCenter * speed * -0.1);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, [ref, speed]);

    return (
        <div ref={setRef} className={cn('overflow-hidden', className)}>
            <div
                style={{
                    transform: `translateY(${offset}px)`,
                    transition: 'transform 0.1s ease-out',
                }}
            >
                {children}
            </div>
        </div>
    );
}
