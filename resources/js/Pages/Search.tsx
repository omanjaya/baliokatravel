import { Head, router, usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HeroSection } from '@/components/landing/HeroSection';
import { SearchBox } from '@/components/search/SearchBox';
import { FilterSidebar } from '@/components/search/FilterSidebar';
import { ActivityGrid } from '@/components/activity/ActivityGrid';
import {
    SlidersHorizontal,
    Grid3X3,
    List,
    ArrowUpDown,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Activity, BaliArea, Category, PageProps } from '@/types';

interface Props {
    activities: {
        data: Activity[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        q?: string;
        area?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        sort?: string;
    };
    areas: BaliArea[];
    categories: Category[];
}

const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];

export default function Search({ activities, filters, areas, categories }: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const activeFiltersCount = Object.entries(filters)
        .filter(([key, value]) => key !== 'q' && key !== 'sort' && value)
        .length;

    const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
        router.get('/search', { ...filters, ...newFilters }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    const handleClearFilters = useCallback(() => {
        router.get('/search', { q: filters.q }, { preserveState: true });
    }, [filters.q]);

    const handleSortChange = useCallback((value: string) => {
        router.get('/search', { ...filters, sort: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    const handlePageChange = (page: number) => {
        router.get('/search', { ...filters, page }, { preserveScroll: true });
    };

    return (
        <GuestLayout>
            <Head title="Find Activities - BaliokaTravel" />

            {/* Hero Section */}
            <HeroSection
                title="Find Your Perfect Adventure"
                subtitle={`Explore ${activities.total}+ activities across Bali`}
                variant="compact"
                showSearch={false}
            />

            <div className="container py-8">
                {/* Search Bar */}
                <SearchBox
                    areas={areas}
                    categories={categories}
                    initialValues={filters}
                    variant="full"
                    className="mb-6"
                />

                <div className="flex gap-8 lg:gap-12">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24">
                            <FilterSidebar
                                areas={areas}
                                categories={categories}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={handleClearFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                {/* Mobile Filter Button */}
                                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" className="lg:hidden gap-2">
                                            <SlidersHorizontal className="h-4 w-4" />
                                            Filters
                                            {activeFiltersCount > 0 && (
                                                <Badge variant="secondary" className="ml-1">
                                                    {activeFiltersCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80 overflow-y-auto">
                                        <FilterSidebar
                                            areas={areas}
                                            categories={categories}
                                            filters={filters}
                                            onFilterChange={(f) => {
                                                handleFilterChange(f);
                                                setIsFilterOpen(false);
                                            }}
                                            onClearFilters={() => {
                                                handleClearFilters();
                                                setIsFilterOpen(false);
                                            }}
                                        />
                                    </SheetContent>
                                </Sheet>

                                {/* Results Count */}
                                <div>
                                    <p className="font-semibold">
                                        {activities.total} {activities.total === 1 ? 'activity' : 'activities'} found
                                    </p>
                                    {filters.q && (
                                        <p className="text-sm text-muted-foreground">
                                            for "{filters.q}"
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Sort */}
                                <Select
                                    value={filters.sort || 'popular'}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* View Mode Toggle */}
                                <div className="hidden md:flex items-center border rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setViewMode('grid')}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setViewMode('list')}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {activeFiltersCount > 0 && (
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {filters.area && (
                                    <Badge variant="secondary" className="gap-1">
                                        {areas.find(a => a.id === filters.area)?.name || filters.area}
                                        <button
                                            onClick={() => handleFilterChange({ ...filters, area: undefined })}
                                            className="ml-1 hover:text-destructive"
                                            aria-label="Remove area filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filters.category && (
                                    <Badge variant="secondary" className="gap-1">
                                        {categories.find(c => c.id === filters.category)?.name.replace('_', ' ') || filters.category}
                                        <button
                                            onClick={() => handleFilterChange({ ...filters, category: undefined })}
                                            className="ml-1 hover:text-destructive"
                                            aria-label="Remove category filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                {filters.minRating && (
                                    <Badge variant="secondary" className="gap-1">
                                        {filters.minRating}+ Rating
                                        <button
                                            onClick={() => handleFilterChange({ ...filters, minRating: undefined })}
                                            className="ml-1 hover:text-destructive"
                                            aria-label="Remove rating filter"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-muted-foreground"
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Activity Grid */}
                        <ActivityGrid
                            activities={activities.data}
                            columns={viewMode === 'list' ? 1 : 3}
                            variant={viewMode === 'list' ? 'horizontal' : 'default'}
                            emptyMessage="No activities match your search criteria. Try adjusting your filters."
                        />

                        {/* Pagination */}
                        {activities.last_page > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    disabled={activities.current_page === 1}
                                    onClick={() => handlePageChange(activities.current_page - 1)}
                                >
                                    Previous
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, activities.last_page) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={page === activities.current_page ? 'default' : 'outline'}
                                                size="icon"
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                    {activities.last_page > 5 && (
                                        <>
                                            <span className="px-2">...</span>
                                            <Button
                                                variant={activities.current_page === activities.last_page ? 'default' : 'outline'}
                                                size="icon"
                                                onClick={() => handlePageChange(activities.last_page)}
                                            >
                                                {activities.last_page}
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <Button
                                    variant="outline"
                                    disabled={activities.current_page === activities.last_page}
                                    onClick={() => handlePageChange(activities.current_page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
