<?php
// app/Support/Helpers/PriceHelper.php

namespace App\Support\Helpers;

class PriceHelper
{
    private const USD_TO_IDR_RATE = 15500;

    /**
     * Format price as Indonesian Rupiah
     */
    public static function formatIDR(int|float $amount): string
    {
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    /**
     * Format price as US Dollar
     */
    public static function formatUSD(int|float $amount): string
    {
        return '$' . number_format($amount, 2, '.', ',');
    }

    /**
     * Convert IDR to USD
     */
    public static function idrToUsd(int $idrAmount, ?float $rate = null): float
    {
        $rate = $rate ?? self::USD_TO_IDR_RATE;
        return round($idrAmount / $rate, 2);
    }

    /**
     * Convert USD to IDR
     */
    public static function usdToIdr(float $usdAmount, ?float $rate = null): int
    {
        $rate = $rate ?? self::USD_TO_IDR_RATE;
        return (int) round($usdAmount * $rate);
    }

    /**
     * Calculate child price (default 70% of adult price)
     */
    public static function calculateChildPrice(int $adultPrice, float $discount = 0.3): int
    {
        return (int) round($adultPrice * (1 - $discount));
    }

    /**
     * Calculate service fee
     */
    public static function calculateServiceFee(int $subtotal, float $percentage = 0.05): int
    {
        return (int) round($subtotal * $percentage);
    }
}
