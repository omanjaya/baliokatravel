<?php

namespace App\Filament\Resources\BaliAreaResource\Pages;

use App\Filament\Resources\BaliAreaResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditBaliArea extends EditRecord
{
    protected static string $resource = BaliAreaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }
}
