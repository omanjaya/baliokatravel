import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Grid, List, SlidersHorizontal, MapPin, Star, Calendar, Users, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { activitiesApi, type SearchFilters } from '../api';
import type { Activity, BaliArea, Category } from '../types';

export function Activities() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [areas, setAreas] = useState<BaliArea[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
    });

    const getFiltersFromParams = (): SearchFilters => ({
        query: searchParams.get('q') || undefined,
        area: searchParams.get('area') || undefined,
        category: searchParams.get('category') || undefined,
        sort_by: (searchParams.get('sort') as SearchFilters['sort_by']) || undefined,
        page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    });

    const [filters, setFilters] = useState<SearchFilters>(getFiltersFromParams);

    useEffect(() => {
        const fetchMeta = async () => {
            try {
                const [areasRes, categoriesRes] = await Promise.all([
                    activitiesApi.getAreas(),
                    activitiesApi.getCategories(),
                ]);
                setAreas(areasRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch meta:', error);
            }
        };
        fetchMeta();
    }, []);

    useEffect(() => {
        const fetchActivities = async () => {
            setIsLoading(true);
            try {
                const response = await activitiesApi.search(filters);
                setActivities(response.data);
                setPagination({
                    currentPage: response.meta.current_page,
                    lastPage: response.meta.last_page,
                    total: response.meta.total,
                });
            } catch (error) {
                console.error('Failed to fetch activities:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, [filters]);

    const updateFilters = (newFilters: Partial<SearchFilters>) => {
        const updated = { ...filters, ...newFilters, page: 1 };
        setFilters(updated);

        const params = new URLSearchParams();
        Object.entries(updated).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.set(key === 'query' ? 'q' : key === 'sort_by' ? 'sort' : key, String(value));
            }
        });
        setSearchParams(params);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateFilters({ query: searchQuery });
    };

    const handlePageChange = (page: number) => {
        setFilters({ ...filters, page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins} min`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        Explore Activities
                    </h1>
                    <p className="text-white/60">
                        Discover {pagination.total} amazing experiences across Bali
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="glass-card rounded-xl p-4 flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <Input
                                type="text"
                                placeholder="Search activities..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/10 border-white/20"
                            />
                        </div>
                        <Button type="submit" className="btn-ocean">
                            Search
                        </Button>
                    </div>
                </form>

                <div className="flex gap-8">
                    {/* Sidebar Filters */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="glass-card rounded-xl p-4 sticky top-24 space-y-6">
                            {/* Areas */}
                            <div>
                                <h3 className="text-white font-semibold mb-3">Areas</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => updateFilters({ area: undefined })}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            !filters.area ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        All Areas
                                    </button>
                                    {areas.map((area) => (
                                        <button
                                            key={area.id}
                                            onClick={() => updateFilters({ area: area.id })}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                filters.area === area.id ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10'
                                            }`}
                                        >
                                            {area.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <h3 className="text-white font-semibold mb-3">Categories</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => updateFilters({ category: undefined })}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                            !filters.category ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10'
                                        }`}
                                    >
                                        All Categories
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => updateFilters({ category: category.id })}
                                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                                filters.category === category.id ? 'bg-primary text-white' : 'text-white/70 hover:bg-white/10'
                                            }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6 glass rounded-xl p-4">
                            <span className="text-white/60 text-sm">
                                {pagination.total} activities found
                            </span>
                            <select
                                value={filters.sort_by || ''}
                                onChange={(e) => updateFilters({ sort_by: e.target.value as SearchFilters['sort_by'] })}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
                            >
                                <option value="">Popular</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                                <option value="newest">Newest</option>
                            </select>
                        </div>

                        {/* Activities Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="glass-card rounded-2xl h-80 animate-pulse" />
                                ))}
                            </div>
                        ) : activities.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {activities.map((activity) => (
                                    <Link
                                        key={activity.id}
                                        to={`/activities/${activity.slug}`}
                                        className="glass-card rounded-2xl overflow-hidden group"
                                    >
                                        <div className="aspect-[4/3] relative overflow-hidden">
                                            <img
                                                src={activity.cover_image || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4'}
                                                alt={activity.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-white text-sm font-medium">
                                                    {activity.rating_average?.toFixed(1) || '4.5'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                                <MapPin className="w-4 h-4" />
                                                <span>{activity.area?.name || 'Bali'}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                                {activity.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-white/60 text-sm">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDuration(activity.duration_minutes)}
                                                    </span>
                                                </div>
                                                <span className="text-primary font-bold">
                                                    {formatPrice(activity.price_idr)}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card rounded-2xl p-12 text-center">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    No activities found
                                </h3>
                                <p className="text-white/60 mb-4">
                                    Try adjusting your filters or search criteria
                                </p>
                                <Button onClick={() => {
                                    setFilters({});
                                    setSearchParams(new URLSearchParams());
                                }}>
                                    Clear All Filters
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination.lastPage > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <Button
                                    variant="outline"
                                    disabled={pagination.currentPage === 1}
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-white/60">
                                    Page {pagination.currentPage} of {pagination.lastPage}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={pagination.currentPage === pagination.lastPage}
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Activities;
