<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ActivityTest extends TestCase
{
    use RefreshDatabase;

    protected Area $area;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create basic data
        $this->area = Area::factory()->create(['name' => 'Ubud']);
        $this->category = Category::factory()->create(['name' => 'Adventure']);
    }

    public function test_home_page_displays_featured_activities(): void
    {
        Activity::factory()->count(3)->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
            'is_featured' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('featuredActivities', 3)
        );
    }

    public function test_search_page_returns_activities(): void
    {
        Activity::factory()->count(5)->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);

        $response = $this->get('/search');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Search')
            ->has('activities.data')
        );
    }

    public function test_search_filters_by_area(): void
    {
        $anotherArea = Area::factory()->create(['name' => 'Seminyak']);
        
        Activity::factory()->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);
        
        Activity::factory()->create([
            'area_id' => $anotherArea->id,
            'category_id' => $this->category->id,
            'status' => 'active',
        ]);

        $response = $this->get('/search?area=' . $this->area->id);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Search')
            ->has('activities.data', 1)
        );
    }

    public function test_activity_show_page_displays_details(): void
    {
        $activity = Activity::factory()->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
            'title' => 'Mount Batur Sunrise Trek',
            'slug' => 'mount-batur-sunrise-trek',
        ]);

        $response = $this->get('/activities/' . $activity->slug);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Activities/Show')
            ->has('activity')
            ->where('activity.title', 'Mount Batur Sunrise Trek')
        );
    }

    public function test_inactive_activity_returns_404(): void
    {
        $activity = Activity::factory()->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'inactive',
            'slug' => 'inactive-activity',
        ]);

        $response = $this->get('/activities/' . $activity->slug);

        $response->assertStatus(404);
    }

    public function test_search_filters_by_price_range(): void
    {
        Activity::factory()->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
            'price_idr' => 500000,
        ]);
        
        Activity::factory()->create([
            'area_id' => $this->area->id,
            'category_id' => $this->category->id,
            'status' => 'active',
            'price_idr' => 1500000,
        ]);

        $response = $this->get('/search?min_price=400000&max_price=600000');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('activities.data', 1)
        );
    }
}
