<?php

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
