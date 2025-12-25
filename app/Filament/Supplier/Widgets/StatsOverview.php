<?php

namespace App\Filament\Supplier\Widgets;

use App\Enums\ActivityStatus;
use App\Enums\BookingStatus;
use App\Models\Activity;
use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $supplierId = auth()->id();
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        // Bookings for supplier's activities
        $bookingsThisMonth = Booking::whereHas('activity', function ($query) use ($supplierId) {
            $query->where('supplier_id', $supplierId);
        })->where('created_at', '>=', $thisMonth)->count();

        $bookingsLastMonth = Booking::whereHas('activity', function ($query) use ($supplierId) {
            $query->where('supplier_id', $supplierId);
        })->whereBetween('created_at', [$lastMonth, $thisMonth])->count();

        // Revenue for supplier's activities
        $revenueThisMonth = Booking::whereHas('activity', function ($query) use ($supplierId) {
            $query->where('supplier_id', $supplierId);
        })->where('status', BookingStatus::Completed)
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_amount');

        $revenueLastMonth = Booking::whereHas('activity', function ($query) use ($supplierId) {
            $query->where('supplier_id', $supplierId);
        })->where('status', BookingStatus::Completed)
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('total_amount');

        // Activities stats
        $publishedActivities = Activity::where('supplier_id', $supplierId)
            ->where('status', ActivityStatus::Published)
            ->count();

        $pendingActivities = Activity::where('supplier_id', $supplierId)
            ->where('status', ActivityStatus::Pending)
            ->count();

        return [
            Stat::make('My Bookings', number_format(Booking::whereHas('activity', function ($query) use ($supplierId) {
                $query->where('supplier_id', $supplierId);
            })->count()))
                ->description($bookingsThisMonth . ' this month')
                ->descriptionIcon($bookingsThisMonth > $bookingsLastMonth ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($bookingsThisMonth > $bookingsLastMonth ? 'success' : 'danger'),

            Stat::make('Revenue (IDR)', 'Rp ' . number_format($revenueThisMonth))
                ->description('This month')
                ->descriptionIcon($revenueThisMonth > $revenueLastMonth ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueThisMonth > $revenueLastMonth ? 'success' : 'danger'),

            Stat::make('Published Activities', number_format($publishedActivities))
                ->description($pendingActivities . ' pending review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info'),

            Stat::make('Average Rating', number_format(Activity::where('supplier_id', $supplierId)->avg('rating_average') ?? 0, 1))
                ->description('From ' . Activity::where('supplier_id', $supplierId)->sum('review_count') . ' reviews')
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),
        ];
    }
}
