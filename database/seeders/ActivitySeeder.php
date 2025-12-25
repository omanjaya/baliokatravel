<?php

namespace Database\Seeders;

use App\Enums\ActivityStatus;
use App\Enums\Difficulty;
use App\Enums\UserRole;
use App\Models\Activity;
use App\Models\ActivityAvailability;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        // Create supplier users
        $suppliers = [
            User::create([
                'name' => 'Bali Adventure Tours',
                'email' => 'supplier1@baliokatravel.com',
                'password' => bcrypt('password'),
                'role' => UserRole::Supplier,
                'business_name' => 'Bali Adventure Tours',
                'business_description' => 'Leading adventure tour operator in Bali',
                'business_phone' => '+62 361 234 5678',
                'business_email' => 'info@baliadventure.com',
                'phone' => '+62 361 234 5678',
                'is_verified_supplier' => true,
            ]),
            User::create([
                'name' => 'Island Experiences',
                'email' => 'supplier2@baliokatravel.com',
                'password' => bcrypt('password'),
                'role' => UserRole::Supplier,
                'business_name' => 'Island Experiences Bali',
                'business_description' => 'Authentic island experiences and water activities',
                'business_phone' => '+62 361 345 6789',
                'business_email' => 'hello@islandexperiences.com',
                'phone' => '+62 361 345 6789',
                'is_verified_supplier' => true,
            ]),
            User::create([
                'name' => 'Bali Cultural Tours',
                'email' => 'supplier3@baliokatravel.com',
                'password' => bcrypt('password'),
                'role' => UserRole::Supplier,
                'business_name' => 'Bali Cultural Tours',
                'business_description' => 'Traditional Balinese cultural experiences',
                'business_phone' => '+62 361 456 7890',
                'business_email' => 'contact@baliculture.com',
                'phone' => '+62 361 456 7890',
                'is_verified_supplier' => true,
            ]),
        ];

        // Sample activities
        $activities = [
            // Water Sports - Seminyak
            [
                'title' => 'Surf Lesson for Beginners at Seminyak Beach',
                'area_id' => 'seminyak',
                'category_id' => 'water_sports',
                'supplier_id' => $suppliers[0]->id,
                'short_description' => 'Learn to surf with professional instructors on Bali\'s best beginner-friendly waves',
                'description' => "Join our experienced surf instructors for a fun and safe introduction to surfing. Perfect for complete beginners, this 2-hour lesson includes all equipment, beach theory, and plenty of time in the water.\n\nOur patient instructors will guide you through the basics of paddling, standing up, and catching your first waves. Most students are standing on their first day!",
                'duration_minutes' => 120,
                'max_group_size' => 8,
                'price_idr' => 500000,
                'price_usd' => 35,
                'difficulty' => Difficulty::Easy,
                'highlights' => ['Professional instructor', 'All equipment included', 'Small group size', 'Perfect for beginners'],
                'included' => ['Surfboard rental', 'Rash guard', 'Professional instructor', 'Insurance'],
                'excluded' => ['Hotel pickup', 'Food and drinks', 'Photos'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
                'meeting_point' => 'Seminyak Beach, in front of La Plancha Beach Bar',
                'meeting_point_lat' => -8.6930,
                'meeting_point_lng' => 115.1594,
                'meeting_point_instructions' => 'Look for our blue tent with "Bali Surf School" sign. Please arrive 15 minutes early.',
            ],
            // Adventure - Ubud
            [
                'title' => 'White Water Rafting Adventure on Ayung River',
                'area_id' => 'ubud',
                'category_id' => 'adventure',
                'supplier_id' => $suppliers[0]->id,
                'short_description' => 'Thrilling rafting experience through jungle rapids and waterfalls',
                'description' => "Experience the thrill of white water rafting on the famous Ayung River. Navigate through Grade II-III rapids, pass by stunning waterfalls, and enjoy the lush jungle scenery.\n\nThis 2-hour rafting adventure is perfect for both beginners and experienced rafters. Professional guides will ensure your safety while you enjoy the excitement of Bali's longest rafting route.",
                'duration_minutes' => 180,
                'max_group_size' => 12,
                'price_idr' => 450000,
                'price_usd' => 32,
                'child_price_idr' => 350000,
                'difficulty' => Difficulty::Moderate,
                'highlights' => ['12km of rapids', 'Stunning waterfalls', 'Expert guides', 'Buffet lunch included'],
                'included' => ['Rafting equipment', 'Life jacket', 'Helmet', 'Lunch buffet', 'Shower facilities', 'Insurance'],
                'excluded' => ['Hotel pickup', 'Towels', 'Photos and videos'],
                'languages' => ['English', 'Indonesian', 'Mandarin'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
                'meeting_point' => 'Payangan Rafting Start Point, Ubud',
                'meeting_point_lat' => -8.4039,
                'meeting_point_lng' => 115.2644,
                'meeting_point_instructions' => 'Meet at the rafting base camp. We will provide transport down to the river.',
            ],
            // Culture - Ubud
            [
                'title' => 'Traditional Balinese Cooking Class with Market Tour',
                'area_id' => 'ubud',
                'category_id' => 'food',
                'supplier_id' => $suppliers[2]->id,
                'short_description' => 'Learn authentic Balinese recipes in a traditional village setting',
                'description' => "Immerse yourself in Balinese culinary traditions with this hands-on cooking class. Start with a guided tour of a local market, then learn to prepare 5 authentic dishes in a beautiful garden setting.\n\nYour local chef will teach you traditional techniques and share stories about Balinese food culture. Enjoy your creations for lunch with stunning rice terrace views.",
                'duration_minutes' => 300,
                'max_group_size' => 10,
                'price_idr' => 550000,
                'price_usd' => 38,
                'difficulty' => Difficulty::Easy,
                'highlights' => ['Market tour', 'Learn 5 traditional dishes', 'Rice terrace views', 'Recipe booklet'],
                'included' => ['Market tour', 'All ingredients', 'Cooking class', 'Lunch', 'Recipe book', 'Pickup from Ubud area'],
                'excluded' => ['Pickup outside Ubud', 'Drinks'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
            ],
            // Wellness - Canggu
            [
                'title' => 'Sunset Yoga Session on the Beach',
                'area_id' => 'canggu',
                'category_id' => 'wellness',
                'supplier_id' => $suppliers[1]->id,
                'short_description' => 'Relax and rejuvenate with oceanfront yoga as the sun sets',
                'description' => "End your day perfectly with a peaceful yoga session on Canggu Beach. Practice gentle vinyasa flow as you watch the sun dip into the Indian Ocean.\n\nSuitable for all levels, this 90-minute class focuses on relaxation, breathing, and connecting with nature. Mats and props provided.",
                'duration_minutes' => 90,
                'max_group_size' => 15,
                'price_idr' => 200000,
                'price_usd' => 14,
                'difficulty' => Difficulty::Easy,
                'highlights' => ['Beachfront location', 'Sunset views', 'All levels welcome', 'Mat provided'],
                'included' => ['Yoga mat', 'Towel', 'Professional instructor', 'Fresh coconut water'],
                'excluded' => ['Hotel pickup', 'Additional drinks'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => false,
                'status' => ActivityStatus::Published,
            ],
            // Adventure - Kintamani
            [
                'title' => 'Mount Batur Sunrise Trekking with Breakfast',
                'area_id' => 'kintamani',
                'category_id' => 'adventure',
                'supplier_id' => $suppliers[0]->id,
                'short_description' => 'Watch the sunrise from an active volcano summit',
                'description' => "Experience the magic of sunrise from the summit of Mount Batur, an active volcano standing 1,717m above sea level. This early morning trek is challenging but incredibly rewarding.\n\nYour guide will lead you up the mountain in the dark, reaching the summit in time for a spectacular sunrise. Enjoy breakfast cooked using volcanic steam while taking in panoramic views of Lake Batur and surrounding mountains.",
                'duration_minutes' => 420,
                'max_group_size' => 10,
                'price_idr' => 650000,
                'price_usd' => 45,
                'difficulty' => Difficulty::Challenging,
                'highlights' => ['Volcanic summit sunrise', 'Breakfast cooked with volcano steam', 'Lake Batur views', 'Hot springs visit option'],
                'included' => ['Hotel pickup from south Bali', 'Experienced guide', 'Flashlight', 'Breakfast on summit', 'Entry fees'],
                'excluded' => ['Hot springs entry (optional)', 'Personal expenses'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
            ],
            // Tours - Nusa Penida
            [
                'title' => 'Nusa Penida Island Day Trip (Kelingking, Angel Billabong)',
                'area_id' => 'nusa_penida',
                'category_id' => 'island_hopping',
                'supplier_id' => $suppliers[1]->id,
                'short_description' => 'Explore Nusa Penida\'s iconic Instagram spots',
                'description' => "Discover the breathtaking beauty of Nusa Penida on this full-day tour. Visit the famous Kelingking Beach (T-Rex), Angel's Billabong, and Broken Beach.\n\nThis tour includes fast boat transfers, private transport on the island, and visits to the most stunning viewpoints. Perfect for photographers and adventure seekers!",
                'duration_minutes' => 600,
                'max_group_size' => 8,
                'price_idr' => 850000,
                'price_usd' => 60,
                'difficulty' => Difficulty::Moderate,
                'highlights' => ['Kelingking Beach viewpoint', 'Angel\'s Billabong', 'Broken Beach', 'Crystal Bay snorkeling'],
                'included' => ['Fast boat return tickets', 'Private car on island', 'English-speaking driver', 'Entry fees', 'Lunch'],
                'excluded' => ['Snorkeling equipment rental', 'Hotel pickup'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
            ],
            // Culture - Ubud
            [
                'title' => 'Ubud Royal Palace & Temples Tour with Barong Dance',
                'area_id' => 'ubud',
                'category_id' => 'culture',
                'supplier_id' => $suppliers[2]->id,
                'short_description' => 'Immerse yourself in Balinese culture and tradition',
                'description' => "Explore Ubud's cultural heart with visits to ancient temples, royal palaces, and a traditional Barong dance performance.\n\nVisit Ubud Palace, Saraswati Temple, and the sacred Monkey Forest. End with a mesmerizing Barong dance show depicting the eternal battle between good and evil.",
                'duration_minutes' => 360,
                'max_group_size' => 12,
                'price_idr' => 600000,
                'price_usd' => 42,
                'difficulty' => Difficulty::Easy,
                'highlights' => ['Ubud Royal Palace', 'Barong dance performance', 'Sacred Monkey Forest', 'Saraswati Temple'],
                'included' => ['Private guide', 'All entry tickets', 'Barong dance show', 'Pickup from Ubud'],
                'excluded' => ['Lunch', 'Monkey food', 'Pickup outside Ubud'],
                'languages' => ['English', 'Indonesian', 'Japanese'],
                'is_featured' => false,
                'status' => ActivityStatus::Published,
            ],
            // Water Sports - Nusa Dua
            [
                'title' => 'Scuba Diving Experience for Beginners (PADI Discover)',
                'area_id' => 'nusa_dua',
                'category_id' => 'water_sports',
                'supplier_id' => $suppliers[1]->id,
                'short_description' => 'First-time diving in crystal clear waters',
                'description' => "Try scuba diving for the first time with our PADI Discover Scuba program. No certification needed - just a sense of adventure!\n\nAfter a brief pool session, you'll make two dives in the beautiful waters of Nusa Dua, reaching depths of up to 12 meters. Our PADI instructors ensure your safety and comfort throughout.",
                'duration_minutes' => 240,
                'max_group_size' => 4,
                'price_idr' => 950000,
                'price_usd' => 65,
                'difficulty' => Difficulty::Easy,
                'highlights' => ['PADI certified instructors', 'Small group ratio', 'All equipment included', 'Two ocean dives'],
                'included' => ['Pool training', 'All diving equipment', 'Two boat dives', 'PADI instructor', 'Underwater photos', 'Light snacks'],
                'excluded' => ['Hotel pickup', 'Lunch', 'Certification course upgrade'],
                'languages' => ['English', 'Indonesian'],
                'is_featured' => true,
                'status' => ActivityStatus::Published,
            ],
        ];

        foreach ($activities as $activityData) {
            // Auto-generate slug if not provided
            if (!isset($activityData['slug'])) {
                $activityData['slug'] = \Illuminate\Support\Str::slug($activityData['title']);
            }

            $activity = Activity::create($activityData);

            // Create availabilities for the next 30 days
            for ($i = 1; $i <= 30; $i++) {
                $date = now()->addDays($i)->format('Y-m-d');

                // Morning slot
                ActivityAvailability::create([
                    'activity_id' => $activity->id,
                    'date' => $date,
                    'start_time' => '08:00',
                    'end_time' => date('H:i', strtotime('08:00') + ($activity->duration_minutes * 60)),
                    'total_spots' => $activity->max_group_size,
                    'available_spots' => $activity->max_group_size,
                    'status' => 'open',
                ]);

                // Afternoon slot (not for sunrise trek)
                if (!str_contains($activity->title, 'Sunrise')) {
                    ActivityAvailability::create([
                        'activity_id' => $activity->id,
                        'date' => $date,
                        'start_time' => '14:00',
                        'end_time' => date('H:i', strtotime('14:00') + ($activity->duration_minutes * 60)),
                        'total_spots' => $activity->max_group_size,
                        'available_spots' => $activity->max_group_size,
                        'status' => 'open',
                    ]);
                }
            }
        }

        $this->command->info('Created ' . count($activities) . ' activities with availabilities');
        $this->command->info('Created ' . count($suppliers) . ' supplier users');
        $this->command->info('Supplier login: supplier1@baliokatravel.com / password');
    }
}
