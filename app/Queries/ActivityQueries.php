<?php
// app/Queries/ActivityQueries.php

namespace App\Queries;

use App\DTOs\SearchFiltersData;
use App\Enums\ActivityStatus;
use App\Models\Activity;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ActivityQueries
{
    /**
     * Search activities with filters
     */
    public function search(SearchFiltersData $filters): LengthAwarePaginator
    {
        return $this->baseQuery()
            ->when($filters->keyword, fn (Builder $q, $keyword) => 
                $q->where(function ($q) use ($keyword) {
                    $q->where('title', 'like', "%{$keyword}%")
                      ->orWhere('description', 'like', "%{$keyword}%")
                      ->orWhere('short_description', 'like', "%{$keyword}%");
                })
            )
            ->when($filters->area, fn (Builder $q, $area) => 
                $q->where('area_id', $area)
            )
            ->when($filters->category, fn (Builder $q, $category) => 
                $q->where('category_id', $category)
            )
            ->when($filters->minPrice, fn (Builder $q, $minPrice) => 
                $q->where('price_idr', '>=', $minPrice)
            )
            ->when($filters->maxPrice, fn (Builder $q, $maxPrice) => 
                $q->where('price_idr', '<=', $maxPrice)
            )
            ->when($filters->minRating, fn (Builder $q, $minRating) => 
                $q->where('rating_average', '>=', $minRating)
            )
            ->when($filters->difficulty, fn (Builder $q, $difficulty) => 
                $q->where('difficulty', $difficulty)
            )
            ->when($filters->date, fn (Builder $q, $date) => 
                $q->whereHas('availabilities', function ($q) use ($date) {
                    $q->where('date', $date)
                      ->where('status', 'open')
                      ->where('available_spots', '>', 0);
                })
            )
            ->when($filters->guests, fn (Builder $q, $guests) => 
                $q->where('max_group_size', '>=', $guests)
            )
            ->tap(fn (Builder $q) => $this->applySorting($q, $filters->sort))
            ->paginate($filters->perPage);
    }

    /**
     * Get featured activities
     */
    public function featured(int $limit = 6): Collection
    {
        return $this->baseQuery()
            ->where('is_featured', true)
            ->orderByDesc('rating_average')
            ->limit($limit)
            ->get();
    }

    /**
     * Get popular activities
     */
    public function popular(int $limit = 10): Collection
    {
        return $this->baseQuery()
            ->orderByDesc('review_count')
            ->orderByDesc('rating_average')
            ->limit($limit)
            ->get();
    }

    /**
     * Get activities by area
     */
    public function byArea(string $areaId, int $perPage = 12): LengthAwarePaginator
    {
        return $this->baseQuery()
            ->where('area_id', $areaId)
            ->orderByDesc('is_featured')
            ->orderByDesc('rating_average')
            ->paginate($perPage);
    }

    /**
     * Get activities by category
     */
    public function byCategory(string $categoryId, int $perPage = 12): LengthAwarePaginator
    {
        return $this->baseQuery()
            ->where('category_id', $categoryId)
            ->orderByDesc('is_featured')
            ->orderByDesc('rating_average')
            ->paginate($perPage);
    }

    /**
     * Get similar activities to a given activity
     */
    public function similar(Activity $activity, int $limit = 4): Collection
    {
        return $this->baseQuery()
            ->where('id', '!=', $activity->id)
            ->where(function ($q) use ($activity) {
                $q->where('category_id', $activity->category_id)
                  ->orWhere('area_id', $activity->area_id);
            })
            ->orderByDesc('rating_average')
            ->limit($limit)
            ->get();
    }

    /**
     * Get single activity by slug with all relationships
     */
    public function findBySlug(string $slug): ?Activity
    {
        return Activity::with([
            'area', 
            'category', 
            'supplier:id,name,business_name,avatar',
            'availabilities' => fn ($q) => 
                $q->where('status', 'open')
                  ->where('date', '>=', now()->toDateString())
                  ->orderBy('date')
                  ->orderBy('start_time'),
        ])
        ->published()
        ->where('slug', $slug)
        ->first();
    }

    /**
     * Base query with common eager loads and published scope
     */
    private function baseQuery(): Builder
    {
        return Activity::query()
            ->with(['area:id,name', 'category:id,name', 'supplier:id,name,business_name'])
            ->published();
    }

    /**
     * Apply sorting to query
     */
    private function applySorting(Builder $query, string $sort): void
    {
        match ($sort) {
            'price_low' => $query->orderBy('price_idr'),
            'price_high' => $query->orderByDesc('price_idr'),
            'rating' => $query->orderByDesc('rating_average'),
            'newest' => $query->orderByDesc('published_at'),
            default => $query->orderByDesc('review_count')->orderByDesc('rating_average'),
        };
    }
}
