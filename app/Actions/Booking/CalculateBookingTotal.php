<?php
// app/Actions/Booking/CalculateBookingTotal.php

namespace App\Actions\Booking;

use App\DTOs\ParticipantsData;
use App\Models\Activity;

class CalculateBookingTotal
{
    private const SERVICE_FEE_PERCENT = 0.05; // 5%
    
    public function __invoke(Activity $activity, ParticipantsData $participants): array
    {
        $adultPrice = (int) $activity->price_idr;
        $childPrice = (int) ($activity->child_price_idr ?? round($adultPrice * 0.7));
        
        $adultTotal = $participants->adults * $adultPrice;
        $childTotal = $participants->children * $childPrice;
        
        $subtotal = $adultTotal + $childTotal;
        $serviceFee = (int) round($subtotal * self::SERVICE_FEE_PERCENT);
        $total = $subtotal + $serviceFee;
        
        return [
            'adult_price' => $adultPrice,
            'child_price' => $childPrice,
            'adults' => $participants->adults,
            'children' => $participants->children,
            'adult_total' => $adultTotal,
            'child_total' => $childTotal,
            'subtotal' => $subtotal,
            'service_fee' => $serviceFee,
            'service_fee_percent' => self::SERVICE_FEE_PERCENT * 100,
            'total' => $total,
            'currency' => 'IDR',
        ];
    }

    /**
     * Quick calculation for price preview
     */
    public function preview(int $adultPrice, ?int $childPrice, int $adults, int $children = 0): array
    {
        $childPrice = $childPrice ?? (int) round($adultPrice * 0.7);
        
        $adultTotal = $adults * $adultPrice;
        $childTotal = $children * $childPrice;
        $subtotal = $adultTotal + $childTotal;
        $serviceFee = (int) round($subtotal * self::SERVICE_FEE_PERCENT);
        
        return [
            'subtotal' => $subtotal,
            'service_fee' => $serviceFee,
            'total' => $subtotal + $serviceFee,
        ];
    }
}
