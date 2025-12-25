# 🎛️ Filament Guide - BaliokaTravel

## Admin & Supplier Panels dengan Filament 3

---

## Why Filament?

| Manual Build | Dengan Filament |
|--------------|-----------------|
| Admin panel: 2-3 minggu | **1-2 hari** |
| CRUD per entity: 2-3 hari | **30 menit** |
| Form validation: manual | **Built-in** |
| Table sorting/filtering: manual | **Built-in** |
| File upload: setup sendiri | **Built-in** |
| Dashboard widgets: custom | **Built-in** |

---

## Setup

### Installation

```bash
# Install Filament
composer require filament/filament:"^3.2"

# Publish config & assets
php artisan filament:install --panels

# Create admin user
php artisan make:filament-user
```

### Create Panels

```bash
# Admin Panel (sudah ada dari install)
# Supplier Panel (create new)
php artisan make:filament-panel supplier
```

---

## Panel Configuration

### Admin Panel Provider

```php
<?php
// app/Providers/Filament/AdminPanelProvider.php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Sky,
                'danger' => Color::Rose,
                'success' => Color::Emerald,
                'warning' => Color::Orange,
            ])
            ->brandName('BaliokaTravel Admin')
            ->brandLogo(asset('images/logo.svg'))
            ->favicon(asset('favicon.ico'))
            ->discoverResources(in: app_path('Filament/Admin/Resources'), for: 'App\\Filament\\Admin\\Resources')
            ->discoverPages(in: app_path('Filament/Admin/Pages'), for: 'App\\Filament\\Admin\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Admin/Widgets'), for: 'App\\Filament\\Admin\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->navigationGroups([
                'Content',
                'Bookings',
                'Users',
                'Settings',
            ]);
    }
}
```

### Supplier Panel Provider

```php
<?php
// app/Providers/Filament/SupplierPanelProvider.php

namespace App\Providers\Filament;

use App\Http\Middleware\EnsureUserIsSupplier;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class SupplierPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->id('supplier')
            ->path('supplier')
            ->login()
            ->registration()
            ->colors([
                'primary' => Color::Orange,
            ])
            ->brandName('BaliokaTravel Supplier')
            ->discoverResources(in: app_path('Filament/Supplier/Resources'), for: 'App\\Filament\\Supplier\\Resources')
            ->discoverPages(in: app_path('Filament/Supplier/Pages'), for: 'App\\Filament\\Supplier\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Supplier/Widgets'), for: 'App\\Filament\\Supplier\\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ])
            ->tenant(null); // No multi-tenancy untuk sekarang
    }
}
```

---

## Admin Resources

### Activity Resource (Admin)

```php
<?php
// app/Filament/Admin/Resources/ActivityResource.php

namespace App\Filament\Admin\Resources;

use App\Enums\ActivityStatus;
use App\Enums\Difficulty;
use App\Filament\Admin\Resources\ActivityResource\Pages;
use App\Models\Activity;
use App\Models\BaliArea;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ActivityResource extends Resource
{
    protected static ?string $model = Activity::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Activity')
                    ->tabs([
                        // Basic Info Tab
                        Forms\Components\Tabs\Tab::make('Basic Info')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('title')
                                            ->required()
                                            ->maxLength(255)
                                            ->live(onBlur: true)
                                            ->afterStateUpdated(fn ($state, $set) => 
                                                $set('slug', \Str::slug($state))
                                            ),

                                        Forms\Components\TextInput::make('slug')
                                            ->required()
                                            ->unique(ignoreRecord: true),

                                        Forms\Components\Select::make('area_id')
                                            ->label('Bali Area')
                                            ->options(BaliArea::pluck('name', 'id'))
                                            ->required()
                                            ->searchable(),

                                        Forms\Components\Select::make('category_id')
                                            ->label('Category')
                                            ->options(Category::pluck('name', 'id'))
                                            ->required()
                                            ->searchable(),

                                        Forms\Components\Select::make('supplier_id')
                                            ->label('Supplier')
                                            ->relationship('supplier', 'name')
                                            ->required()
                                            ->searchable(),

                                        Forms\Components\Select::make('status')
                                            ->options(ActivityStatus::class)
                                            ->default(ActivityStatus::Draft)
                                            ->required(),
                                    ]),

                                Forms\Components\Textarea::make('short_description')
                                    ->rows(2)
                                    ->maxLength(255),

                                Forms\Components\RichEditor::make('description')
                                    ->required()
                                    ->columnSpanFull(),
                            ]),

                        // Details Tab
                        Forms\Components\Tabs\Tab::make('Details')
                            ->schema([
                                Forms\Components\Grid::make(3)
                                    ->schema([
                                        Forms\Components\TextInput::make('duration_minutes')
                                            ->label('Duration (minutes)')
                                            ->numeric()
                                            ->required()
                                            ->default(60),

                                        Forms\Components\TextInput::make('min_group_size')
                                            ->numeric()
                                            ->required()
                                            ->default(1),

                                        Forms\Components\TextInput::make('max_group_size')
                                            ->numeric()
                                            ->required()
                                            ->default(10),
                                    ]),

                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Select::make('difficulty')
                                            ->options(Difficulty::class)
                                            ->default(Difficulty::Easy),

                                        Forms\Components\TextInput::make('min_age')
                                            ->numeric()
                                            ->nullable(),
                                    ]),

                                Forms\Components\TagsInput::make('languages')
                                    ->default(['en', 'id']),

                                Forms\Components\TagsInput::make('highlights')
                                    ->placeholder('Add highlights'),

                                Forms\Components\TagsInput::make('included')
                                    ->placeholder('What\'s included'),

                                Forms\Components\TagsInput::make('excluded')
                                    ->placeholder('What\'s not included'),
                            ]),

                        // Pricing Tab
                        Forms\Components\Tabs\Tab::make('Pricing')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('price_idr')
                                            ->label('Adult Price (IDR)')
                                            ->numeric()
                                            ->required()
                                            ->prefix('Rp'),

                                        Forms\Components\TextInput::make('price_usd')
                                            ->label('Adult Price (USD)')
                                            ->numeric()
                                            ->prefix('$'),

                                        Forms\Components\TextInput::make('child_price_idr')
                                            ->label('Child Price (IDR)')
                                            ->numeric()
                                            ->prefix('Rp'),

                                        Forms\Components\TextInput::make('child_price_usd')
                                            ->label('Child Price (USD)')
                                            ->numeric()
                                            ->prefix('$'),
                                    ]),
                            ]),

                        // Media Tab
                        Forms\Components\Tabs\Tab::make('Media')
                            ->schema([
                                Forms\Components\FileUpload::make('cover_image')
                                    ->image()
                                    ->directory('activities/covers')
                                    ->imageResizeMode('cover')
                                    ->imageCropAspectRatio('4:3')
                                    ->imageResizeTargetWidth('800')
                                    ->imageResizeTargetHeight('600'),

                                Forms\Components\FileUpload::make('images')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->directory('activities/gallery')
                                    ->maxFiles(10),

                                Forms\Components\TextInput::make('video_url')
                                    ->url()
                                    ->placeholder('YouTube or Vimeo URL'),
                            ]),

                        // Location Tab
                        Forms\Components\Tabs\Tab::make('Location')
                            ->schema([
                                Forms\Components\TextInput::make('meeting_point')
                                    ->maxLength(255),

                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('meeting_point_lat')
                                            ->label('Latitude')
                                            ->numeric(),

                                        Forms\Components\TextInput::make('meeting_point_lng')
                                            ->label('Longitude')
                                            ->numeric(),
                                    ]),

                                Forms\Components\Textarea::make('meeting_point_instructions')
                                    ->rows(3),
                            ]),

                        // Settings Tab
                        Forms\Components\Tabs\Tab::make('Settings')
                            ->schema([
                                Forms\Components\Toggle::make('instant_booking')
                                    ->default(true)
                                    ->helperText('Allow instant booking without supplier confirmation'),

                                Forms\Components\Toggle::make('is_featured')
                                    ->helperText('Show on homepage featured section'),

                                Forms\Components\Select::make('cancellation_policy')
                                    ->options([
                                        'flexible' => 'Flexible - Full refund 24h before',
                                        'moderate' => 'Moderate - Full refund 48h before',
                                        'strict' => 'Strict - 50% refund 7 days before',
                                    ])
                                    ->default('flexible'),

                                Forms\Components\Textarea::make('rejection_reason')
                                    ->rows(3)
                                    ->visible(fn ($record) => $record?->status === ActivityStatus::Rejected),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->circular()
                    ->size(50),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('area.name')
                    ->badge()
                    ->color('info'),

                Tables\Columns\TextColumn::make('category.name')
                    ->badge(),

                Tables\Columns\TextColumn::make('supplier.name')
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('price_idr')
                    ->money('IDR')
                    ->sortable(),

                Tables\Columns\TextColumn::make('rating_average')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => number_format($state, 1) . ' ⭐'),

                Tables\Columns\TextColumn::make('review_count')
                    ->label('Reviews')
                    ->alignCenter(),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (ActivityStatus $state) => match ($state) {
                        ActivityStatus::Published => 'success',
                        ActivityStatus::Pending => 'warning',
                        ActivityStatus::Draft => 'gray',
                        ActivityStatus::Rejected => 'danger',
                        ActivityStatus::Archived => 'gray',
                    }),

                Tables\Columns\IconColumn::make('is_featured')
                    ->boolean()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(ActivityStatus::class),

                Tables\Filters\SelectFilter::make('area_id')
                    ->label('Area')
                    ->options(BaliArea::pluck('name', 'id')),

                Tables\Filters\SelectFilter::make('category_id')
                    ->label('Category')
                    ->options(Category::pluck('name', 'id')),

                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\ViewAction::make(),
                    Tables\Actions\EditAction::make(),

                    Tables\Actions\Action::make('approve')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->visible(fn ($record) => $record->status === ActivityStatus::Pending)
                        ->action(fn ($record) => $record->update(['status' => ActivityStatus::Published, 'published_at' => now()])),

                    Tables\Actions\Action::make('reject')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->form([
                            Forms\Components\Textarea::make('rejection_reason')
                                ->required(),
                        ])
                        ->visible(fn ($record) => $record->status === ActivityStatus::Pending)
                        ->action(fn ($record, array $data) => $record->update([
                            'status' => ActivityStatus::Rejected,
                            'rejection_reason' => $data['rejection_reason'],
                        ])),

                    Tables\Actions\DeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),

                    Tables\Actions\BulkAction::make('approve')
                        ->icon('heroicon-o-check-circle')
                        ->requiresConfirmation()
                        ->action(fn ($records) => $records->each->update([
                            'status' => ActivityStatus::Published,
                            'published_at' => now(),
                        ])),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            // RelationManagers\AvailabilitiesRelationManager::class,
            // RelationManagers\BookingsRelationManager::class,
            // RelationManagers\ReviewsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListActivities::route('/'),
            'create' => Pages\CreateActivity::route('/create'),
            'edit' => Pages\EditActivity::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', ActivityStatus::Pending)->count() ?: null;
    }

    public static function getNavigationBadgeColor(): string|array|null
    {
        return 'warning';
    }
}
```

### Booking Resource (Admin)

```php
<?php
// app/Filament/Admin/Resources/BookingResource.php

namespace App\Filament\Admin\Resources;

use App\Enums\BookingStatus;
use App\Filament\Admin\Resources\BookingResource\Pages;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Infolists;
use Filament\Infolists\Infolist;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationGroup = 'Bookings';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Booking Info')
                    ->schema([
                        Forms\Components\TextInput::make('reference')
                            ->disabled(),

                        Forms\Components\Select::make('status')
                            ->options(BookingStatus::class)
                            ->required(),

                        Forms\Components\Textarea::make('supplier_notes')
                            ->rows(3),
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

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('until'),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['from'], fn ($q) => $q->whereDate('created_at', '>=', $data['from']))
                            ->when($data['until'], fn ($q) => $q->whereDate('created_at', '<=', $data['until']));
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
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

                Infolists\Components\Section::make('Pricing')
                    ->schema([
                        Infolists\Components\TextEntry::make('total_participants'),
                        Infolists\Components\TextEntry::make('subtotal')
                            ->money('IDR'),
                        Infolists\Components\TextEntry::make('total_amount')
                            ->money('IDR')
                            ->weight('bold'),
                    ])->columns(3),
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
        return static::getModel()::where('status', BookingStatus::Pending)->count() ?: null;
    }
}
```

---

## Supplier Resources

### Activity Resource (Supplier)

```php
<?php
// app/Filament/Supplier/Resources/ActivityResource.php

namespace App\Filament\Supplier\Resources;

use App\Enums\ActivityStatus;
use App\Models\Activity;
use App\Models\BaliArea;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ActivityResource extends Resource
{
    protected static ?string $model = Activity::class;
    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    protected static ?string $navigationLabel = 'My Activities';

    // Hanya tampilkan activities milik supplier yang login
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->where('supplier_id', auth()->id());
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Basic Info')
                    ->schema([
                        Forms\Components\Hidden::make('supplier_id')
                            ->default(auth()->id()),

                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255),

                        Forms\Components\Select::make('area_id')
                            ->label('Location')
                            ->options(BaliArea::pluck('name', 'id'))
                            ->required()
                            ->searchable(),

                        Forms\Components\Select::make('category_id')
                            ->options(Category::pluck('name', 'id'))
                            ->required(),

                        Forms\Components\Textarea::make('short_description')
                            ->rows(2)
                            ->maxLength(255),

                        Forms\Components\RichEditor::make('description')
                            ->required(),
                    ]),

                Forms\Components\Section::make('Details')
                    ->schema([
                        Forms\Components\Grid::make(3)
                            ->schema([
                                Forms\Components\TextInput::make('duration_minutes')
                                    ->numeric()
                                    ->required()
                                    ->suffix('minutes'),

                                Forms\Components\TextInput::make('max_group_size')
                                    ->numeric()
                                    ->required(),

                                Forms\Components\TextInput::make('min_age')
                                    ->numeric(),
                            ]),

                        Forms\Components\TagsInput::make('highlights'),
                        Forms\Components\TagsInput::make('included'),
                        Forms\Components\TagsInput::make('excluded'),
                    ]),

                Forms\Components\Section::make('Pricing')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('price_idr')
                                    ->label('Adult Price (IDR)')
                                    ->numeric()
                                    ->required()
                                    ->prefix('Rp'),

                                Forms\Components\TextInput::make('child_price_idr')
                                    ->label('Child Price (IDR)')
                                    ->numeric()
                                    ->prefix('Rp'),
                            ]),
                    ]),

                Forms\Components\Section::make('Media')
                    ->schema([
                        Forms\Components\FileUpload::make('cover_image')
                            ->image()
                            ->directory('activities/covers'),

                        Forms\Components\FileUpload::make('images')
                            ->image()
                            ->multiple()
                            ->directory('activities/gallery')
                            ->maxFiles(10),
                    ]),

                Forms\Components\Section::make('Location')
                    ->schema([
                        Forms\Components\TextInput::make('meeting_point'),
                        Forms\Components\Textarea::make('meeting_point_instructions')
                            ->rows(2),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('cover_image')
                    ->circular(),

                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('area.name')
                    ->badge(),

                Tables\Columns\TextColumn::make('price_idr')
                    ->money('IDR'),

                Tables\Columns\TextColumn::make('rating_average')
                    ->formatStateUsing(fn ($state) => $state ? number_format($state, 1) . ' ⭐' : '-'),

                Tables\Columns\TextColumn::make('booking_count')
                    ->label('Bookings'),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (ActivityStatus $state) => match ($state) {
                        ActivityStatus::Published => 'success',
                        ActivityStatus::Pending => 'warning',
                        ActivityStatus::Draft => 'gray',
                        ActivityStatus::Rejected => 'danger',
                        default => 'gray',
                    }),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options(ActivityStatus::class),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),

                Tables\Actions\Action::make('submit')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Submit for Review')
                    ->modalDescription('Your activity will be reviewed by our team before publishing.')
                    ->visible(fn ($record) => $record->status === ActivityStatus::Draft)
                    ->action(fn ($record) => $record->update(['status' => ActivityStatus::Pending])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => \App\Filament\Supplier\Resources\ActivityResource\Pages\ListActivities::route('/'),
            'create' => \App\Filament\Supplier\Resources\ActivityResource\Pages\CreateActivity::route('/create'),
            'edit' => \App\Filament\Supplier\Resources\ActivityResource\Pages\EditActivity::route('/{record}/edit'),
        ];
    }
}
```

---

## Dashboard Widgets

### Admin Stats Widget

```php
<?php
// app/Filament/Admin/Widgets/StatsOverview.php

namespace App\Filament\Admin\Widgets;

use App\Enums\BookingStatus;
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

        return [
            Stat::make('Total Bookings', Booking::count())
                ->description($bookingsThisMonth . ' this month')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Revenue (IDR)', 'Rp ' . number_format($revenueThisMonth))
                ->description('This month')
                ->color('success'),

            Stat::make('Active Activities', Activity::published()->count())
                ->description(Activity::where('status', 'pending')->count() . ' pending review')
                ->color('info'),

            Stat::make('Users', User::count())
                ->description(User::where('role', 'supplier')->count() . ' suppliers')
                ->color('gray'),
        ];
    }
}
```

### Latest Bookings Widget

```php
<?php
// app/Filament/Admin/Widgets/LatestBookings.php

namespace App\Filament\Admin\Widgets;

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
            ->query(Booking::query()->latest()->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('reference')
                    ->weight('bold'),
                Tables\Columns\TextColumn::make('activity.title')
                    ->limit(20),
                Tables\Columns\TextColumn::make('user.name'),
                Tables\Columns\TextColumn::make('total_amount')
                    ->money('IDR'),
                Tables\Columns\TextColumn::make('status')
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->since(),
            ])
            ->paginated(false);
    }
}
```

---

## Generate Resources Commands

```bash
# Admin Resources
php artisan make:filament-resource Activity --panel=admin
php artisan make:filament-resource Booking --panel=admin
php artisan make:filament-resource User --panel=admin
php artisan make:filament-resource BaliArea --panel=admin
php artisan make:filament-resource Category --panel=admin
php artisan make:filament-resource Review --panel=admin

# Supplier Resources
php artisan make:filament-resource Activity --panel=supplier
php artisan make:filament-resource Booking --panel=supplier

# Widgets
php artisan make:filament-widget StatsOverview --panel=admin
php artisan make:filament-widget LatestBookings --panel=admin --table
php artisan make:filament-widget RevenueChart --panel=admin --chart

# Pages
php artisan make:filament-page Settings --panel=admin
```

---

## Access Control

```php
// User Model - canAccessPanel method

public function canAccessPanel(Panel $panel): bool
{
    if ($panel->getId() === 'admin') {
        return $this->role === UserRole::Admin;
    }
    
    if ($panel->getId() === 'supplier') {
        return $this->role === UserRole::Supplier;
    }
    
    return false;
}
```

---

## URLs

| Panel | URL | Access |
|-------|-----|--------|
| Admin | `/admin` | Admin only |
| Supplier | `/supplier` | Supplier only |

---

## Next: Continue to Deployment Guide →
