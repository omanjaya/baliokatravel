<?php
// app/Support/Helpers/BookingReferenceGenerator.php

namespace App\Support\Helpers;

use App\Models\Booking;

class BookingReferenceGenerator
{
    /**
     * Generate a unique booking reference in format: BOT-2025-XXXXXX
     * BOT = BaliOkayTravel
     */
    public function generate(): string
    {
        do {
            $reference = $this->createReference();
        } while ($this->referenceExists($reference));
        
        return $reference;
    }

    private function createReference(): string
    {
        $year = date('Y');
        $random = strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 6));
        
        return "BOT-{$year}-{$random}";
    }

    private function referenceExists(string $reference): bool
    {
        return Booking::where('reference', $reference)->exists();
    }
}
