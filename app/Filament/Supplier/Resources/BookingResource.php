<?php

namespace App\Filament\Supplier\Resources;

use App\Enums\BookingStatus;
use App\Filament\Supplier\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Illuminate\Database\Eloquent\Builder;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationGroup = 'Bookings';

    public static function getEloquentQuery(): Builder
    {
        // Only show bookings for activities owned by the logged-in supplier
        return parent::getEloquentQuery()
            ->whereHas('activity', function ($query) {
                $query->where('supplier_id', auth()->id());
            });
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Booking Info')
                    ->schema([
                        Forms\Components\TextInput::make('reference')
                            ->disabled(),

                        Forms\Components\Select::make('status')
                            ->options([
                                BookingStatus::Pending->value => 'Pending',
                                BookingStatus::Confirmed->value => 'Confirmed',
                                BookingStatus::Completed->value => 'Completed',
                                BookingStatus::Cancelled->value => 'Cancelled',
                                BookingStatus::NoShow->value => 'No Show',
                            ])
                            ->required()
                            ->helperText('Update booking status based on customer attendance'),

                        Forms\Components\Textarea::make('supplier_notes')
                            ->rows(3)
                            ->helperText('Add notes for internal reference'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reference')
                    ->searchable()
                    ->copyable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('activity.title')
                    ->limit(25)
                    ->searchable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable(),

                Tables\Columns\TextColumn::make('availability.date')
                    ->label('Date')
                    ->date()
                    ->sortable(),

                Tables\Columns\TextColumn::make('total_participants')
                    ->label('Guests')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('total_amount')
                    ->money('IDR')
                    ->sortable(),

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
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(BookingStatus::class),

                Tables\Filters\SelectFilter::make('activity_id')
                    ->label('Activity')
                    ->relationship('activity', 'title')
                    ->searchable()
                    ->preload(),

                Tables\Filters\Filter::make('date')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['from'],
                                fn (Builder $query, $date): Builder => $query->whereHas('availability', function ($q) use ($date) {
                                    $q->whereDate('date', '>=', $date);
                                }),
                            )
                            ->when(
                                $data['until'],
                                fn (Builder $query, $date): Builder => $query->whereHas('availability', function ($q) use ($date) {
                                    $q->whereDate('date', '<=', $date);
                                }),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('confirm')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === BookingStatus::Pending)
                    ->action(fn ($record) => $record->update(['status' => BookingStatus::Confirmed])),

                Tables\Actions\Action::make('complete')
                    ->icon('heroicon-o-check-badge')
                    ->color('info')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === BookingStatus::Confirmed)
                    ->action(fn ($record) => $record->update(['status' => BookingStatus::Completed])),

                Tables\Actions\Action::make('no_show')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn ($record) => $record->status === BookingStatus::Confirmed)
                    ->action(fn ($record) => $record->update(['status' => BookingStatus::NoShow])),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Booking Details')
                    ->schema([
                        Infolists\Components\TextEntry::make('reference')
                            ->weight('bold'),
                        Infolists\Components\TextEntry::make('status')
                            ->badge(),
                        Infolists\Components\TextEntry::make('activity.title'),
                        Infolists\Components\TextEntry::make('availability.date')
                            ->date(),
                        Infolists\Components\TextEntry::make('availability.start_time'),
                    ])->columns(3),

                Infolists\Components\Section::make('Customer')
                    ->schema([
                        Infolists\Components\TextEntry::make('contact_name'),
                        Infolists\Components\TextEntry::make('contact_email'),
                        Infolists\Components\TextEntry::make('contact_phone'),
                    ])->columns(3),

                Infolists\Components\Section::make('Participants')
                    ->schema([
                        Infolists\Components\TextEntry::make('total_participants'),
                        Infolists\Components\TextEntry::make('participants')
                            ->label('Breakdown')
                            ->formatStateUsing(function ($state) {
                                if (!$state) return '-';
                                $adults = $state['adults'] ?? 0;
                                $children = $state['children'] ?? 0;
                                return "Adults: {$adults}, Children: {$children}";
                            }),
                    ])->columns(2),

                Infolists\Components\Section::make('Pricing')
                    ->schema([
                        Infolists\Components\TextEntry::make('subtotal')
                            ->money('IDR'),
                        Infolists\Components\TextEntry::make('total_amount')
                            ->money('IDR')
                            ->weight('bold'),
                    ])->columns(2),

                Infolists\Components\Section::make('Notes')
                    ->schema([
                        Infolists\Components\TextEntry::make('supplier_notes')
                            ->placeholder('No notes added'),
                        Infolists\Components\TextEntry::make('customer_notes')
                            ->placeholder('No customer notes'),
                    ])->columns(2)
                    ->visible(fn ($record) => $record->supplier_notes || $record->customer_notes),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'view' => Pages\ViewBooking::route('/{record}'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereHas('activity', function ($query) {
            $query->where('supplier_id', auth()->id());
        })->where('status', BookingStatus::Pending)->count() ?: null;
    }
}
