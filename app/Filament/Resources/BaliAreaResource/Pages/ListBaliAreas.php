<?php

namespace App\Filament\Resources\BaliAreaResource\Pages;

use App\Filament\Resources\BaliAreaResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBaliAreas extends ListRecords
{
    protected static string $resource = BaliAreaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
