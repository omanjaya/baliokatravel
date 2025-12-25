<?php

namespace App\Support;

use App\Models\Activity;
use App\Models\Area;

class SeoHelper
{
    /**
     * Get meta tags for homepage
     */
    public static function forHome(): array
    {
        return [
            'title' => 'BaliOkayTravel - Discover Amazing Bali Adventures',
            'description' => 'Book the best tours, activities, and experiences in Bali. From Ubud rice terraces to Mount Batur sunrise treks. Verified local providers, instant confirmation.',
            'keywords' => 'Bali tours, Bali activities, Bali experiences, Bali travel, Indonesia tourism',
            'canonical' => config('app.url'),
            'og' => [
                'title' => 'BaliOkayTravel - Your Gateway to Bali Adventures',
                'description' => 'Discover and book amazing experiences across Bali with verified local providers.',
                'type' => 'website',
                'image' => asset('images/og-home.jpg'),
                'url' => config('app.url'),
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => 'BaliOkayTravel - Discover Amazing Bali Adventures',
                'description' => 'Book the best tours and activities in Bali.',
                'image' => asset('images/og-home.jpg'),
            ],
        ];
    }

    /**
     * Get meta tags for activity page
     */
    public static function forActivity(Activity $activity): array
    {
        $price = 'Rp ' . number_format($activity->price_idr, 0, ',', '.');
        
        return [
            'title' => "{$activity->title} | BaliOkayTravel",
            'description' => $activity->short_description ?: substr(strip_tags($activity->description ?? ''), 0, 160),
            'keywords' => implode(', ', [
                $activity->title,
                $activity->area?->name ?? 'Bali',
                $activity->category?->name ?? 'Activity',
                'Bali tours',
                'Bali experiences',
            ]),
            'canonical' => route('activities.show', $activity->slug),
            'og' => [
                'title' => $activity->title,
                'description' => $activity->short_description ?: 'Experience ' . $activity->title . ' in Bali',
                'type' => 'product',
                'image' => $activity->cover_image ?: asset('images/og-default.jpg'),
                'url' => route('activities.show', $activity->slug),
                'price:amount' => $activity->price_idr,
                'price:currency' => 'IDR',
            ],
            'twitter' => [
                'card' => 'summary_large_image',
                'title' => $activity->title,
                'description' => "From {$price} - Book now on BaliOkayTravel",
                'image' => $activity->cover_image ?: asset('images/og-default.jpg'),
            ],
            'schema' => self::activitySchema($activity),
        ];
    }

    /**
     * Get meta tags for area page
     */
    public static function forArea(Area $area): array
    {
        return [
            'title' => "Things to Do in {$area->name}, Bali | BaliOkayTravel",
            'description' => $area->description ?: "Discover the best tours, activities and experiences in {$area->name}, Bali. Book with verified local providers.",
            'keywords' => implode(', ', [
                $area->name,
                "{$area->name} tours",
                "{$area->name} activities",
                'Bali tourism',
            ]),
            'canonical' => route('areas.show', $area),
            'og' => [
                'title' => "Explore {$area->name}, Bali",
                'description' => "Find amazing things to do in {$area->name}",
                'type' => 'website',
                'image' => $area->cover_image ?: asset('images/og-default.jpg'),
                'url' => route('areas.show', $area),
            ],
        ];
    }

    /**
     * Get meta tags for search page
     */
    public static function forSearch(?string $query = null, ?string $areaName = null): array
    {
        $title = 'Search Activities';
        
        if ($query) {
            $title = "Search: {$query}";
        } elseif ($areaName) {
            $title = "Activities in {$areaName}";
        }

        return [
            'title' => "{$title} | BaliOkayTravel",
            'description' => 'Search and discover amazing activities across Bali. Filter by location, price, rating, and more.',
            'robots' => $query ? 'noindex, follow' : 'index, follow',
        ];
    }

    /**
     * Generate JSON-LD schema for activity
     */
    private static function activitySchema(Activity $activity): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'Product',
            'name' => $activity->title,
            'description' => $activity->short_description ?? '',
            'image' => $activity->cover_image,
            'offers' => [
                '@type' => 'Offer',
                'price' => $activity->price_idr,
                'priceCurrency' => 'IDR',
                'availability' => 'https://schema.org/InStock',
            ],
            'aggregateRating' => $activity->review_count > 0 ? [
                '@type' => 'AggregateRating',
                'ratingValue' => $activity->rating_average,
                'reviewCount' => $activity->review_count,
            ] : null,
            'provider' => [
                '@type' => 'TravelAgency',
                'name' => 'BaliOkayTravel',
                'url' => config('app.url'),
            ],
        ];
    }

    /**
     * Generate organization schema
     */
    public static function organizationSchema(): array
    {
        return [
            '@context' => 'https://schema.org',
            '@type' => 'TravelAgency',
            'name' => 'BaliOkayTravel',
            'url' => config('app.url'),
            'logo' => asset('images/logo.png'),
            'description' => 'Book the best tours and activities in Bali with verified local providers.',
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => 'Denpasar',
                'addressRegion' => 'Bali',
                'addressCountry' => 'ID',
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'customer service',
                'email' => 'support@baliokatravel.com',
            ],
        ];
    }
}
