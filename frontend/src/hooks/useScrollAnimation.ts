import { useEffect, useRef, useState, RefObject } from 'react';

interface UseScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

/**
 * Hook to detect when an element enters the viewport
 * Returns [ref, isVisible] - attach ref to element, isVisible indicates if in viewport
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
    options: UseScrollAnimationOptions = {}
): [RefObject<T | null>, boolean] {
    const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) {
                        observer.unobserve(element);
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isVisible];
}

/**
 * Hook that returns multiple refs for staggered animations
 */
export function useStaggeredAnimation<T extends HTMLElement = HTMLDivElement>(
    count: number,
    options: UseScrollAnimationOptions = {}
): [RefObject<T>[], boolean[]] {
    const { threshold = 0.1, rootMargin = '50px', triggerOnce = true } = options;
    const refs = useRef<(T | null)[]>([]);
    const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        refs.current.forEach((element, index) => {
            if (!element) return;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        // Stagger the animation with delay based on index
                        setTimeout(() => {
                            setVisibleItems((prev) => {
                                const newState = [...prev];
                                newState[index] = true;
                                return newState;
                            });
                        }, index * 100); // 100ms stagger delay

                        if (triggerOnce) {
                            observer.unobserve(element);
                        }
                    } else if (!triggerOnce) {
                        setVisibleItems((prev) => {
                            const newState = [...prev];
                            newState[index] = false;
                            return newState;
                        });
                    }
                },
                { threshold, rootMargin }
            );

            observer.observe(element);
            observers.push(observer);
        });

        return () => observers.forEach((observer) => observer.disconnect());
    }, [count, threshold, rootMargin, triggerOnce]);

    // Create callback refs for each item
    const setRef = (index: number) => (el: T | null) => {
        refs.current[index] = el;
    };

    // Return callback refs and visibility states
    const callbackRefs = Array.from({ length: count }, (_, i) => setRef(i));

    return [callbackRefs, visibleItems] as unknown as [RefObject<T>[], boolean[]];
}
