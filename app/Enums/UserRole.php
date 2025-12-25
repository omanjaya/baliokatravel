<?php

namespace App\Enums;

enum UserRole: string
{
    case Traveler = 'traveler';
    case Supplier = 'supplier';
    case Admin = 'admin';
}
