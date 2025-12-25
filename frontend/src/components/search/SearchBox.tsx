import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, MapPin, Calendar as CalendarIcon, Compass, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { BaliArea, Category } from '@/types';

interface SearchBoxProps {
    areas?: BaliArea[];
    categories?: Category[];
    initialValues?: {
        keyword?: string;
        area?: string;
        category?: string;
        date?: string;
        guests?: number;
    };
    variant?: 'hero' | 'compact' | 'full';
    onSearch?: (filters: Record<string, any>) => void;
    className?: string;
}

export function SearchBox({
    areas = [],
    categories = [],
    initialValues = {},
    variant = 'hero',
    onSearch,
    className,
}: SearchBoxProps) {
    const navigate = useNavigate();
    const [area, setArea] = useState(initialValues.area || '');
    const [category, setCategory] = useState(initialValues.category || '');
    const [date, setDate] = useState<Date | undefined>(
        initialValues.date ? new Date(initialValues.date) : undefined
    );

    const handleSearch = () => {
        const params: Record<string, any> = {};
        if (area && area !== 'all') params.area = area;
        if (category && category !== 'all') params.category = category;
        if (date) params.date = format(date, 'yyyy-MM-dd');

        if (onSearch) {
            onSearch(params);
        } else {
            const queryString = new URLSearchParams(params as Record<string, string>).toString();
            navigate(`/activities${queryString ? `?${queryString}` : ''}`);
        }
    };

    if (variant === 'compact') {
        return (
            <div className={cn('flex items-center gap-2', className)}>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <input
                        placeholder="Search activities..."
                        className="w-full glass-strong rounded-full pl-10 pr-4 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button
                    onClick={handleSearch}
                    className="btn-ocean p-3 rounded-full"
                >
                    <Search className="h-5 w-5 text-white" />
                </button>
            </div>
        );
    }

    // Hero variant - Glass morphism
    if (variant === 'hero') {
        return (
            <div className={cn('', className)}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Activity Type */}
                    <div className="relative">
                        <label className="block text-white text-sm font-medium mb-2 text-left">
                            Activity Type
                        </label>
                        <div className="relative">
                            <Compass className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 z-10" />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full glass-strong border-0 rounded-2xl pl-12 pr-10 py-4 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-white/30 transition-all bg-transparent"
                            >
                                <option value="" className="bg-gray-800">All Categories</option>
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <option key={cat.id} value={cat.id} className="bg-gray-800">
                                            {cat.name}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="water-sports" className="bg-gray-800">Water Sports</option>
                                        <option value="adventure" className="bg-gray-800">Adventure</option>
                                        <option value="culture" className="bg-gray-800">Culture & Heritage</option>
                                        <option value="food" className="bg-gray-800">Food & Culinary</option>
                                        <option value="wellness" className="bg-gray-800">Wellness & Spa</option>
                                        <option value="tours" className="bg-gray-800">Tours & Sightseeing</option>
                                        <option value="island-hopping" className="bg-gray-800">Island Hopping</option>
                                        <option value="sunset" className="bg-gray-800">Sunset Experience</option>
                                    </>
                                )}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="relative">
                        <label className="block text-white text-sm font-medium mb-2 text-left">
                            Location
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 z-10" />
                            <select
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="w-full glass-strong border-0 rounded-2xl pl-12 pr-10 py-4 text-white appearance-none cursor-pointer focus:ring-2 focus:ring-white/30 transition-all bg-transparent"
                            >
                                <option value="" className="bg-gray-800">All Areas</option>
                                {areas.length > 0 ? (
                                    areas.map((a) => (
                                        <option key={a.id} value={a.id} className="bg-gray-800">
                                            {a.name}
                                        </option>
                                    ))
                                ) : (
                                    <>
                                        <option value="ubud" className="bg-gray-800">Ubud</option>
                                        <option value="seminyak" className="bg-gray-800">Seminyak</option>
                                        <option value="canggu" className="bg-gray-800">Canggu</option>
                                        <option value="nusa-dua" className="bg-gray-800">Nusa Dua</option>
                                        <option value="uluwatu" className="bg-gray-800">Uluwatu</option>
                                        <option value="nusa-penida" className="bg-gray-800">Nusa Penida</option>
                                        <option value="kuta" className="bg-gray-800">Kuta</option>
                                    </>
                                )}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="relative">
                        <label className="block text-white text-sm font-medium mb-2 text-left">
                            Date
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="w-full glass-strong border-0 rounded-2xl px-4 py-4 text-white text-left flex items-center gap-3 focus:ring-2 focus:ring-white/30 transition-all">
                                    <CalendarIcon className="w-5 h-5 text-white/70" />
                                    <span className={date ? 'text-white' : 'text-white/70'}>
                                        {date ? format(date, 'MMM dd, yyyy') : 'Select date'}
                                    </span>
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(d) => d < new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="w-full btn-ocean py-4 rounded-2xl text-white font-semibold text-lg flex items-center justify-center space-x-3 hover:shadow-2xl transition-all"
                >
                    <Search className="w-6 h-6" />
                    <span>Search Activities</span>
                </button>
            </div>
        );
    }

    // Full variant
    return (
        <div className={cn('glass-card rounded-2xl p-6', className)}>
            <div className="grid md:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                    <label className="text-white text-sm font-medium mb-2 block">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full glass-strong rounded-xl px-4 py-3 text-white bg-transparent"
                    >
                        <option value="" className="bg-gray-800">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id} className="bg-gray-800">
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Area */}
                <div>
                    <label className="text-white text-sm font-medium mb-2 block">Area</label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full glass-strong rounded-xl px-4 py-3 text-white bg-transparent"
                    >
                        <option value="" className="bg-gray-800">All Areas</option>
                        {areas.map((a) => (
                            <option key={a.id} value={a.id} className="bg-gray-800">
                                {a.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="text-white text-sm font-medium mb-2 block">Date</label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="w-full glass-strong rounded-xl px-4 py-3 text-white text-left flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-white/70" />
                                <span className={date ? 'text-white' : 'text-white/70'}>
                                    {date ? format(date, 'MMM dd') : 'Any date'}
                                </span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(d) => d < new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Search Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full btn-ocean py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2"
                    >
                        <Search className="w-5 h-5" />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
