<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    protected Activity $activity;
    protected User $user;
    protected Availability $availability;

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
            'price_idr' => 500000,
            'child_price_idr' => 250000,
            'max_group_size' => 10,
        ]);
        
        $this->availability = Availability::factory()->create([
            'activity_id' => $this->activity->id,
            'date' => now()->addDays(7)->toDateString(),
            'start_time' => '09:00',
            'available_spots' => 10,
            'status' => 'open',
        ]);
    }

    public function test_guest_cannot_access_booking_page(): void
    {
        $response = $this->get('/book/' . $this->activity->slug);

        $response->assertRedirect('/login');
    }

    public function test_authenticated_user_can_access_booking_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/book/' . $this->activity->slug);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Booking/Create')
            ->has('activity')
        );
    }

    public function test_user_can_create_booking(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/book', [
                'activity_id' => $this->activity->id,
                'availability_id' => $this->availability->id,
                'adults' => 2,
                'children' => 1,
                'contact_name' => 'John Doe',
                'contact_email' => 'john@example.com',
                'contact_phone' => '+62812345678',
                'special_requests' => 'Vegetarian meal please',
            ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('bookings', [
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'contact_name' => 'John Doe',
            'status' => 'pending',
        ]);
    }

    public function test_booking_requires_contact_info(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/book', [
                'activity_id' => $this->activity->id,
                'availability_id' => $this->availability->id,
                'adults' => 2,
                'children' => 0,
                // Missing contact info
            ]);

        $response->assertSessionHasErrors(['contact_name', 'contact_email']);
    }

    public function test_booking_requires_at_least_one_adult(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/book', [
                'activity_id' => $this->activity->id,
                'availability_id' => $this->availability->id,
                'adults' => 0,
                'children' => 2,
                'contact_name' => 'John Doe',
                'contact_email' => 'john@example.com',
            ]);

        $response->assertSessionHasErrors(['adults']);
    }

    public function test_user_can_view_their_bookings(): void
    {
        Booking::factory()->count(3)->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/dashboard/bookings');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/Bookings/Index')
            ->has('bookings.data', 3)
        );
    }

    public function test_user_can_view_single_booking(): void
    {
        $booking = Booking::factory()->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/dashboard/bookings/' . $booking->id);

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/Bookings/Show')
            ->has('booking')
        );
    }

    public function test_user_cannot_view_others_booking(): void
    {
        $otherUser = User::factory()->create();
        $booking = Booking::factory()->create([
            'user_id' => $otherUser->id,
            'activity_id' => $this->activity->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get('/dashboard/bookings/' . $booking->id);

        $response->assertStatus(403);
    }

    public function test_user_can_cancel_pending_booking(): void
    {
        $booking = Booking::factory()->create([
            'user_id' => $this->user->id,
            'activity_id' => $this->activity->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->user)
            ->post('/book/' . $booking->id . '/cancel');

        $response->assertRedirect();
        
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }
}
