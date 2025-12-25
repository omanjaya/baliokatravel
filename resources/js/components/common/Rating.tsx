import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
    value: number;
    count?: number;
    size?: 'sm' | 'md' | 'lg';
    showCount?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};

const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
};

export function Rating({
    value,
    count,
    size = 'md',
    showCount = true,
    className
}: RatingProps) {
    const safeValue = typeof value === 'number' ? value : 0;

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <Star className={cn(sizeClasses[size], 'fill-yellow-400 text-yellow-400')} />
            <span className={cn('font-semibold', textSizeClasses[size])}>
                {safeValue.toFixed(1)}
            </span>
            {showCount && count !== undefined && (
                <span className={cn('text-muted-foreground', textSizeClasses[size])}>
                    ({count})
                </span>
            )}
        </div>
    );
}

export function RatingStars({
    value,
    maxStars = 5,
    size = 'md',
    className
}: {
    value: number;
    maxStars?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    const safeValue = typeof value === 'number' ? value : 0;

    return (
        <div className={cn('flex items-center gap-0.5', className)}>
            {Array.from({ length: maxStars }).map((_, i) => (
                <Star
                    key={i}
                    className={cn(
                        sizeClasses[size],
                        i < Math.floor(safeValue)
                            ? 'fill-yellow-400 text-yellow-400'
                            : i < safeValue
                                ? 'fill-yellow-200 text-yellow-400'
                                : 'text-gray-300'
                    )}
                />
            ))}
        </div>
    );
}
