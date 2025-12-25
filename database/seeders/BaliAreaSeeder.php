<?php

namespace Database\Seeders;

use App\Models\BaliArea;
use Illuminate\Database\Seeder;

class BaliAreaSeeder extends Seeder
{
    public function run(): void
    {
        $areas = [
            ['id' => 'ubud', 'name' => 'Ubud', 'popular_for' => ['culture', 'rice_terraces', 'yoga', 'art']],
            ['id' => 'seminyak', 'name' => 'Seminyak', 'popular_for' => ['beach_clubs', 'shopping', 'restaurants']],
            ['id' => 'kuta', 'name' => 'Kuta', 'popular_for' => ['surfing', 'beach', 'nightlife']],
            ['id' => 'canggu', 'name' => 'Canggu', 'popular_for' => ['surfing', 'cafes', 'digital_nomads']],
            ['id' => 'nusa_dua', 'name' => 'Nusa Dua', 'popular_for' => ['luxury', 'water_sports', 'resorts']],
            ['id' => 'sanur', 'name' => 'Sanur', 'popular_for' => ['calm_beach', 'sunrise', 'family']],
            ['id' => 'uluwatu', 'name' => 'Uluwatu', 'popular_for' => ['temples', 'surfing', 'cliffs']],
            ['id' => 'jimbaran', 'name' => 'Jimbaran', 'popular_for' => ['seafood', 'sunset', 'beach']],
            ['id' => 'kintamani', 'name' => 'Kintamani', 'popular_for' => ['volcano', 'trekking', 'sunrise']],
            ['id' => 'nusa_penida', 'name' => 'Nusa Penida', 'popular_for' => ['snorkeling', 'island', 'photography']],
            ['id' => 'nusa_lembongan', 'name' => 'Nusa Lembongan', 'popular_for' => ['diving', 'mangroves']],
            ['id' => 'amed', 'name' => 'Amed', 'popular_for' => ['diving', 'snorkeling', 'quiet']],
            ['id' => 'lovina', 'name' => 'Lovina', 'popular_for' => ['dolphins', 'north_bali', 'waterfalls']],
        ];

        foreach ($areas as $area) {
            BaliArea::updateOrCreate(
                ['id' => $area['id']],
                $area
            );
        }
    }
}
