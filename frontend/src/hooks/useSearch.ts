import { useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchStore, filtersToParams } from '@/stores/searchStore';

/**
 * Hook for managing search functionality
 */
export function useSearch() {
    const store = useSearchStore();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /**
     * Execute search with current filters
     */
    const search = useCallback(() => {
        const params = filtersToParams(store.filters);
        store.setLoading(true);

        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        navigate(`/activities?${queryString}`);
        store.setLoading(false);
    }, [store.filters, navigate]);

    /**
     * Search with new filters (replaces current filters)
     */
    const searchWith = useCallback((filters: Partial<typeof store.filters>) => {
        store.setFilters(filters);
        const params = filtersToParams({ ...store.filters, ...filters });
        store.setLoading(true);

        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        navigate(`/activities?${queryString}`);
        store.setLoading(false);
    }, [store.filters, navigate]);

    /**
     * Update a single filter and search
     */
    const filterAndSearch = useCallback(<K extends keyof typeof store.filters>(
        key: K,
        value: typeof store.filters[K]
    ) => {
        store.setFilter(key, value);
        const newFilters = { ...store.filters, [key]: value };
        const params = filtersToParams(newFilters);

        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        navigate(`/activities?${queryString}`);
    }, [store.filters, navigate]);

    /**
     * Clear all filters and search
     */
    const clearFilters = useCallback(() => {
        store.resetFilters();
        navigate('/activities');
    }, [navigate]);

    /**
     * Quick search by keyword
     */
    const quickSearch = useCallback((keyword: string) => {
        store.setFilter('keyword', keyword);
        navigate(`/activities?q=${encodeURIComponent(keyword)}`);
    }, [navigate]);

    /**
     * Count of active filters (excluding defaults)
     */
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (store.filters.area) count++;
        if (store.filters.category) count++;
        if (store.filters.date) count++;
        if (store.filters.guests > 1) count++;
        if (store.filters.minPrice > 0) count++;
        if (store.filters.maxPrice < 10000000) count++;
        if (store.filters.minRating > 0) count++;
        return count;
    }, [store.filters]);

    /**
     * Check if any filters are active
     */
    const hasActiveFilters = activeFiltersCount > 0;

    return {
        // State
        filters: store.filters,
        isLoading: store.isLoading,

        // Computed
        activeFiltersCount,
        hasActiveFilters,

        // Actions
        search,
        searchWith,
        filterAndSearch,
        clearFilters,
        quickSearch,
        setFilter: store.setFilter,
        setFilters: store.setFilters,
        resetFilters: store.resetFilters,
    };
}
