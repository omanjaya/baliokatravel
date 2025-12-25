<?php

namespace App\Filament\Admin\Widgets;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Monthly Revenue (Last 6 Months)';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $data = [];
        $labels = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->format('M Y');

            $revenue = Booking::where('status', BookingStatus::Completed)
                ->whereYear('created_at', $month->year)
                ->whereMonth('created_at', $month->month)
                ->sum('total_amount');

            $data[] = $revenue / 1000000; // Convert to millions
        }

        return [
            'datasets' => [
                [
                    'label' => 'Revenue (Million IDR)',
                    'data' => $data,
                    'backgroundColor' => 'rgba(14, 165, 233, 0.1)',
                    'borderColor' => 'rgb(14, 165, 233)',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
