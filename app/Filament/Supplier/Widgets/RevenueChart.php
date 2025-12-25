<?php

namespace App\Filament\Supplier\Widgets;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Filament\Widgets\ChartWidget;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'My Revenue (Last 6 Months)';

    protected static ?int $sort = 3;

    protected function getData(): array
    {
        $supplierId = auth()->id();
        $data = [];
        $labels = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->format('M Y');

            $revenue = Booking::whereHas('activity', function ($query) use ($supplierId) {
                $query->where('supplier_id', $supplierId);
            })
                ->where('status', BookingStatus::Completed)
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
                    'backgroundColor' => 'rgba(249, 115, 22, 0.1)',
                    'borderColor' => 'rgb(249, 115, 22)',
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
