import { create } from 'zustand';

interface SearchFilters {
    keyword: string;
    area: string;
    category: string;
    date: string;
    guests: number;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: 'popular' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

interface SearchStore {
    filters: SearchFilters;
    isLoading: boolean;
    setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
    setFilters: (filters: Partial<SearchFilters>) => void;
    resetFilters: () => void;
    setLoading: (loading: boolean) => void;
}

const defaultFilters: SearchFilters = {
    keyword: '',
    area: '',
    category: '',
    date: '',
    guests: 1,
    minPrice: 0,
    maxPrice: 10000000,
    minRating: 0,
    sortBy: 'popular',
};

export const useSearchStore = create<SearchStore>((set) => ({
    filters: defaultFilters,
    isLoading: false,

    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value }
        })),

    setFilters: (newFilters) =>
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        })),

    resetFilters: () => set({ filters: defaultFilters }),

    setLoading: (isLoading) => set({ isLoading }),
}));

// Helper to convert store filters to URL params
export function filtersToParams(filters: SearchFilters): Record<string, string> {
    const params: Record<string, string> = {};

    if (filters.keyword) params.q = filters.keyword;
    if (filters.area) params.area = filters.area;
    if (filters.category) params.category = filters.category;
    if (filters.date) params.date = filters.date;
    if (filters.guests > 1) params.guests = String(filters.guests);
    if (filters.minPrice > 0) params.min_price = String(filters.minPrice);
    if (filters.maxPrice < 10000000) params.max_price = String(filters.maxPrice);
    if (filters.minRating > 0) params.min_rating = String(filters.minRating);
    if (filters.sortBy !== 'popular') params.sort = filters.sortBy;

    return params;
}

// Helper to parse URL params to filters
export function paramsToFilters(params: URLSearchParams): Partial<SearchFilters> {
    return {
        keyword: params.get('q') || '',
        area: params.get('area') || '',
        category: params.get('category') || '',
        date: params.get('date') || '',
        guests: params.get('guests') ? parseInt(params.get('guests')!) : 1,
        minPrice: params.get('min_price') ? parseInt(params.get('min_price')!) : 0,
        maxPrice: params.get('max_price') ? parseInt(params.get('max_price')!) : 10000000,
        minRating: params.get('min_rating') ? parseFloat(params.get('min_rating')!) : 0,
        sortBy: (params.get('sort') as SearchFilters['sortBy']) || 'popular',
    };
}
