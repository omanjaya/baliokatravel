import { cn } from '@/lib/utils';

interface PriceDisplayProps {
    amount: number;
    currency?: 'IDR' | 'USD';
    originalAmount?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showPerPerson?: boolean;
    className?: string;
}

const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
};

export function formatIDR(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatUSD(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

export function PriceDisplay({
    amount,
    currency = 'IDR',
    originalAmount,
    size = 'lg',
    showPerPerson = true,
    className,
}: PriceDisplayProps) {
    const formattedPrice = currency === 'IDR' ? formatIDR(amount) : formatUSD(amount);
    const hasDiscount = originalAmount && originalAmount > amount;

    return (
        <div className={cn('flex flex-col', className)}>
            <div className="flex items-baseline gap-2">
                {hasDiscount && (
                    <span className="text-muted-foreground line-through text-sm">
                        {currency === 'IDR' ? formatIDR(originalAmount) : formatUSD(originalAmount)}
                    </span>
                )}
                <span className={cn('font-bold text-sky-600', sizeClasses[size])}>
                    {formattedPrice}
                </span>
            </div>
            {showPerPerson && (
                <span className="text-sm text-muted-foreground">per person</span>
            )}
        </div>
    );
}

export function PriceRange({
    minPrice,
    maxPrice,
    currency = 'IDR',
    className,
}: {
    minPrice: number;
    maxPrice: number;
    currency?: 'IDR' | 'USD';
    className?: string;
}) {
    const format = currency === 'IDR' ? formatIDR : formatUSD;
    return (
        <span className={cn('text-muted-foreground', className)}>
            {format(minPrice)} - {format(maxPrice)}
        </span>
    );
}
