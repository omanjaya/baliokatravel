<?php
// app/DTOs/SearchFiltersData.php

namespace App\DTOs;

use Illuminate\Http\Request;

readonly class SearchFiltersData
{
    public function __construct(
        public ?string $keyword = null,
        public ?string $area = null,
        public ?string $category = null,
        public ?string $date = null,
        public ?int $guests = null,
        public ?int $minPrice = null,
        public ?int $maxPrice = null,
        public ?float $minRating = null,
        public ?string $difficulty = null,
        public ?string $sort = 'popular',
        public int $perPage = 12,
        public int $page = 1,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            keyword: $request->input('q'),
            area: $request->input('area'),
            category: $request->input('category'),
            date: $request->input('date'),
            guests: $request->input('guests') ? (int) $request->input('guests') : null,
            minPrice: $request->input('min_price') ? (int) $request->input('min_price') : null,
            maxPrice: $request->input('max_price') ? (int) $request->input('max_price') : null,
            minRating: $request->input('min_rating') ? (float) $request->input('min_rating') : null,
            difficulty: $request->input('difficulty'),
            sort: $request->input('sort', 'popular'),
            perPage: (int) $request->input('per_page', 12),
            page: (int) $request->input('page', 1),
        );
    }

    public function hasFilters(): bool
    {
        return $this->keyword !== null 
            || $this->area !== null 
            || $this->category !== null 
            || $this->date !== null 
            || $this->guests !== null
            || $this->minPrice !== null 
            || $this->maxPrice !== null
            || $this->minRating !== null
            || $this->difficulty !== null;
    }

    public function toArray(): array
    {
        return array_filter([
            'q' => $this->keyword,
            'area' => $this->area,
            'category' => $this->category,
            'date' => $this->date,
            'guests' => $this->guests,
            'min_price' => $this->minPrice,
            'max_price' => $this->maxPrice,
            'min_rating' => $this->minRating,
            'difficulty' => $this->difficulty,
            'sort' => $this->sort,
        ], fn ($value) => $value !== null);
    }
}
