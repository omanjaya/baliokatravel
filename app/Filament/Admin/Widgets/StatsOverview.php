<?php

namespace App\Filament\Admin\Widgets;

use App\Enums\ActivityStatus;
use App\Enums\BookingStatus;
use App\Enums\UserRole;
use App\Models\Activity;
use App\Models\Booking;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $thisMonth = now()->startOfMonth();
        $lastMonth = now()->subMonth()->startOfMonth();

        $bookingsThisMonth = Booking::where('created_at', '>=', $thisMonth)->count();
        $bookingsLastMonth = Booking::whereBetween('created_at', [$lastMonth, $thisMonth])->count();

        $revenueThisMonth = Booking::where('status', BookingStatus::Completed)
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_amount');

        $revenueLastMonth = Booking::where('status', BookingStatus::Completed)
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('total_amount');

        return [
            Stat::make('Total Bookings', number_format(Booking::count()))
                ->description($bookingsThisMonth . ' this month')
                ->descriptionIcon($bookingsThisMonth > $bookingsLastMonth ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($bookingsThisMonth > $bookingsLastMonth ? 'success' : 'danger'),

            Stat::make('Revenue (IDR)', 'Rp ' . number_format($revenueThisMonth))
                ->description('This month')
                ->descriptionIcon($revenueThisMonth > $revenueLastMonth ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueThisMonth > $revenueLastMonth ? 'success' : 'danger'),

            Stat::make('Active Activities', number_format(Activity::where('status', ActivityStatus::Published)->count()))
                ->description(Activity::where('status', ActivityStatus::Pending)->count() . ' pending review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info'),

            Stat::make('Users', number_format(User::count()))
                ->description(User::where('role', UserRole::Supplier)->count() . ' suppliers')
                ->descriptionIcon('heroicon-m-users')
                ->color('gray'),
        ];
    }
}
