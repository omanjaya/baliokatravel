<?php

namespace App\Filament\Supplier\Resources\BookingResource\Pages;

use App\Filament\Supplier\Resources\BookingResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateBooking extends CreateRecord
{
    protected static string $resource = BookingResource::class;
}
