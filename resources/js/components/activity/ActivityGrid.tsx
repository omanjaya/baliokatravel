import { ActivityCard, ActivityCardSkeleton } from '@/components/activity/ActivityCard';
import { cn } from '@/lib/utils';
import type { Activity } from '@/types';

interface ActivityGridProps {
    activities: Activity[];
    columns?: 1 | 2 | 3 | 4;
    variant?: 'default' | 'compact' | 'horizontal';
    loading?: boolean;
    loadingCount?: number;
    emptyMessage?: string;
    className?: string;
}

const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

export function ActivityGrid({
    activities,
    columns = 3,
    variant = 'default',
    loading = false,
    loadingCount = 6,
    emptyMessage = 'No activities found',
    className,
}: ActivityGridProps) {
    if (loading) {
        return (
            <div className={cn('grid gap-6', columnClasses[columns], className)}>
                {Array.from({ length: loadingCount }).map((_, i) => (
                    <ActivityCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Activities Found</h3>
                <p className="text-muted-foreground">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className={cn(
            'grid gap-6',
            variant === 'horizontal' ? 'grid-cols-1' : columnClasses[columns],
            className
        )}>
            {activities.map((activity) => (
                <ActivityCard
                    key={activity.id}
                    activity={activity}
                    variant={variant}
                />
            ))}
        </div>
    );
}
