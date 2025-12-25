<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Activity $activity;
    protected Booking $completedBooking;

    protected function setUp(): void
    {
        parent::setUp();
        
        $area = Area::factory()->create();
        $category = Category::factory()->create();
        
        $this->user = User::factory()->create();
        $this->activity = Activity::factory()->create([
            'area_id' => $area->id,
            'category_id' => $category->id,
            'status' => 'active',
        ]);
        
        $this->completedBooking = Booking::factory()->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'status' => 'completed',
        ]);
    }

    public function test_guest_cannot_access_review_form(): void
    {
        $response = $this->get('/activities/' . $this->activity->id . '/reviews/create');

        $response->assertRedirect('/login');
    }

    public function test_user_with_completed_booking_can_access_review_form(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/activities/' . $this->activity->id . '/reviews/create?booking_id=' . $this->completedBooking->id);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Reviews/Create')
            ->has('activity')
        );
    }

    public function test_user_can_submit_review(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/activities/' . $this->activity->id . '/reviews', [
                'rating' => 5,
                'content' => 'This was an amazing experience! The guide was very knowledgeable and the scenery was breathtaking.',
                'title' => 'Best experience ever!',
                'booking_id' => $this->completedBooking->id,
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('reviews', [
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'rating' => 5,
            'status' => 'published',
        ]);
    }

    public function test_review_requires_minimum_content_length(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/activities/' . $this->activity->id . '/reviews', [
                'rating' => 4,
                'content' => 'Too short',
                'booking_id' => $this->completedBooking->id,
            ]);

        $response->assertSessionHasErrors(['content']);
    }

    public function test_review_requires_valid_rating(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/activities/' . $this->activity->id . '/reviews', [
                'rating' => 6, // Invalid - max is 5
                'content' => 'This is a valid review content with more than twenty characters.',
                'booking_id' => $this->completedBooking->id,
            ]);

        $response->assertSessionHasErrors(['rating']);
    }

    public function test_user_can_view_their_reviews(): void
    {
        Review::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'status' => 'published',
        ]);

        $response = $this->actingAs($this->user)
            ->get('/dashboard/reviews');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/Reviews/Index')
            ->has('reviews.data', 2)
        );
    }

    public function test_user_can_mark_review_as_helpful(): void
    {
        $review = Review::factory()->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'helpful_count' => 0,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/reviews/' . $review->id . '/helpful');

        $response->assertStatus(200);
        $response->assertJson(['helpful_count' => 1]);
    }

    public function test_activity_rating_updates_after_review(): void
    {
        // Create initial review
        $this->actingAs($this->user)
            ->post('/activities/' . $this->activity->id . '/reviews', [
                'rating' => 4,
                'content' => 'Great experience overall. Really enjoyed the tour and the beautiful views.',
                'booking_id' => $this->completedBooking->id,
            ]);

        $this->activity->refresh();
        
        $this->assertEquals(4.0, $this->activity->rating_average);
        $this->assertEquals(1, $this->activity->review_count);
    }
}
