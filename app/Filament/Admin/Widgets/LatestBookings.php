<?php

namespace App\Filament\Admin\Widgets;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestBookings extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    protected static ?int $sort = 2;

    public function table(Table $table): Table
    {
        return $table
            ->query(Booking::query()->with(['activity', 'user'])->latest()->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('reference')
                    ->weight('bold')
                    ->searchable(),

                Tables\Columns\TextColumn::make('activity.title')
                    ->limit(20)
                    ->searchable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable(),

                Tables\Columns\TextColumn::make('total_amount')
                    ->money('IDR'),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (BookingStatus $state) => match ($state) {
                        BookingStatus::Pending => 'warning',
                        BookingStatus::Confirmed => 'success',
                        BookingStatus::Completed => 'info',
                        BookingStatus::Cancelled => 'danger',
                        BookingStatus::Refunded => 'gray',
                        BookingStatus::NoShow => 'danger',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->since()
                    ->sortable(),
            ])
            ->paginated(false);
    }
}
