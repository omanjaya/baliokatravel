<?php

namespace App\Filament\Supplier\Resources\ActivityResource\Pages;

use App\Filament\Supplier\Resources\ActivityResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateActivity extends CreateRecord
{
    protected static string $resource = ActivityResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['supplier_id'] = auth()->id();

        return $data;
    }
}
