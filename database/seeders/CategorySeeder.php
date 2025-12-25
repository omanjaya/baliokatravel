<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 'water_sports', 'name' => 'Water Sports', 'icon' => 'waves', 'display_order' => 1],
            ['id' => 'adventure', 'name' => 'Adventure', 'icon' => 'mountain', 'display_order' => 2],
            ['id' => 'culture', 'name' => 'Culture & Temples', 'icon' => 'landmark', 'display_order' => 3],
            ['id' => 'food', 'name' => 'Food & Cooking', 'icon' => 'utensils', 'display_order' => 4],
            ['id' => 'wellness', 'name' => 'Wellness & Spa', 'icon' => 'heart', 'display_order' => 5],
            ['id' => 'tours', 'name' => 'Tours & Sightseeing', 'icon' => 'map', 'display_order' => 6],
            ['id' => 'island_hopping', 'name' => 'Island Hopping', 'icon' => 'ship', 'display_order' => 7],
            ['id' => 'sunset', 'name' => 'Sunset Activities', 'icon' => 'sunset', 'display_order' => 8],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['id' => $category['id']],
                $category
            );
        }
    }
}
