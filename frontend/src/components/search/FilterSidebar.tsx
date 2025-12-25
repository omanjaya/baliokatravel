import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { X, SlidersHorizontal } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { BaliArea, Category } from '@/types';

interface FilterSidebarProps {
    areas: BaliArea[];
    categories: Category[];
    filters: {
        area?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        minRating?: number;
        difficulty?: string[];
    };
    onFilterChange: (filters: Record<string, any>) => void;
    onClearFilters: () => void;
    className?: string;
}

const difficultyOptions = [
    { value: 'easy', label: 'Easy', description: 'Suitable for everyone' },
    { value: 'moderate', label: 'Moderate', description: 'Some fitness required' },
    { value: 'challenging', label: 'Challenging', description: 'Good fitness needed' },
];

const ratingOptions = [
    { value: 4.5, label: '4.5+', stars: 5 },
    { value: 4, label: '4.0+', stars: 4 },
    { value: 3.5, label: '3.5+', stars: 3 },
];

export function FilterSidebar({
    areas,
    categories,
    filters,
    onFilterChange,
    onClearFilters,
    className,
}: FilterSidebarProps) {
    const [priceRange, setPriceRange] = useState<[number, number]>([
        filters.minPrice || 0,
        filters.maxPrice || 5000000,
    ]);

    const activeFiltersCount = Object.values(filters).filter(
        (v) => v !== undefined && v !== '' && (Array.isArray(v) ? v.length > 0 : true)
    ).length;

    const handleAreaChange = (areaId: string, checked: boolean) => {
        onFilterChange({ ...filters, area: checked ? areaId : undefined });
    };

    const handleCategoryChange = (categoryId: string, checked: boolean) => {
        onFilterChange({ ...filters, category: checked ? categoryId : undefined });
    };

    const handlePriceChange = () => {
        onFilterChange({
            ...filters,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 5000000 ? priceRange[1] : undefined,
        });
    };

    const handleRatingChange = (rating: number) => {
        onFilterChange({
            ...filters,
            minRating: filters.minRating === rating ? undefined : rating,
        });
    };

    const handleDifficultyChange = (difficulty: string, checked: boolean) => {
        const current = filters.difficulty || [];
        const updated = checked
            ? [...current, difficulty]
            : current.filter((d) => d !== difficulty);
        onFilterChange({
            ...filters,
            difficulty: updated.length > 0 ? updated : undefined,
        });
    };

    return (
        <div className={cn('space-y-6', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">Filters</h3>
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary">{activeFiltersCount}</Badge>
                    )}
                </div>
                {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onClearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Clear all
                    </Button>
                )}
            </div>

            <Separator />

            <Accordion type="multiple" defaultValue={['areas', 'categories', 'price', 'rating']}>
                {/* Areas */}
                <AccordionItem value="areas">
                    <AccordionTrigger className="text-sm font-semibold">
                        Location
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {areas.map((area) => (
                                <label
                                    key={area.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2"
                                >
                                    <Checkbox
                                        checked={filters.area === area.id}
                                        onCheckedChange={(checked) =>
                                            handleAreaChange(area.id, checked as boolean)
                                        }
                                    />
                                    <span className="text-sm">{area.name}</span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Categories */}
                <AccordionItem value="categories">
                    <AccordionTrigger className="text-sm font-semibold">
                        Category
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2"
                                >
                                    <Checkbox
                                        checked={filters.category === category.id}
                                        onCheckedChange={(checked) =>
                                            handleCategoryChange(category.id, checked as boolean)
                                        }
                                    />
                                    <span className="text-sm capitalize">
                                        {category.name.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-sm font-semibold">
                        Price Range
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {formatIDR(priceRange[0])}
                                </span>
                                <span className="text-muted-foreground">
                                    {formatIDR(priceRange[1])}
                                </span>
                            </div>
                            <div className="px-2">
                                <input
                                    type="range"
                                    min={0}
                                    max={5000000}
                                    step={100000}
                                    value={priceRange[1]}
                                    onChange={(e) =>
                                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                                    }
                                    onMouseUp={handlePriceChange}
                                    onTouchEnd={handlePriceChange}
                                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                    aria-label="Maximum price range"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange[0] || ''}
                                    onChange={(e) =>
                                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
                                    }
                                    onBlur={handlePriceChange}
                                    className="text-sm"
                                />
                                <Input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange[1] || ''}
                                    onChange={(e) =>
                                        setPriceRange([priceRange[0], parseInt(e.target.value) || 5000000])
                                    }
                                    onBlur={handlePriceChange}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Rating */}
                <AccordionItem value="rating">
                    <AccordionTrigger className="text-sm font-semibold">
                        Rating
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {ratingOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => handleRatingChange(option.value)}
                                    className={cn(
                                        'w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                                        filters.minRating === option.value
                                            ? 'bg-sky-100 text-sky-700'
                                            : 'hover:bg-gray-50'
                                    )}
                                >
                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <svg
                                                key={i}
                                                className={cn(
                                                    'h-4 w-4',
                                                    i < option.stars
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                )}
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="text-sm">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Difficulty */}
                <AccordionItem value="difficulty">
                    <AccordionTrigger className="text-sm font-semibold">
                        Difficulty
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {difficultyOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg -mx-2"
                                >
                                    <Checkbox
                                        checked={filters.difficulty?.includes(option.value)}
                                        onCheckedChange={(checked) =>
                                            handleDifficultyChange(option.value, checked as boolean)
                                        }
                                        className="mt-0.5"
                                    />
                                    <div>
                                        <span className="text-sm font-medium">{option.label}</span>
                                        <p className="text-xs text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
