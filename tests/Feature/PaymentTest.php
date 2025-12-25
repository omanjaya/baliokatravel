<?php

namespace Tests\Feature;

use App\Models\Activity;
use App\Models\Area;
use App\Models\Booking;
use App\Models\Category;
use App\Models\Payment;
use App\Models\User;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Booking $booking;

    protected function setUp(): void
    {
        parent::setUp();
        
        $area = Area::factory()->create();
        $category = Category::factory()->create();
        $activity = Activity::factory()->create([
            'area_id' => $area->id,
            'category_id' => $category->id,
        ]);
        
        $this->user = User::factory()->create();
        $this->booking = Booking::factory()->create([
            'user_id' => $this->user->id,
            'activity_id' => $activity->id,
            'status' => 'pending',
            'total_amount' => 1000000,
        ]);
    }

    public function test_guest_cannot_access_payment_page(): void
    {
        $response = $this->get('/book/' . $this->booking->id . '/payment');

        $response->assertRedirect('/login');
    }

    public function test_user_can_access_payment_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/book/' . $this->booking->id . '/payment');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Booking/Payment')
            ->has('booking')
        );
    }

    public function test_user_cannot_access_others_payment(): void
    {
        $otherUser = User::factory()->create();

        $response = $this->actingAs($otherUser)
            ->get('/book/' . $this->booking->id . '/payment');

        $response->assertStatus(403);
    }

    public function test_payment_create_intent_returns_client_secret(): void
    {
        $this->markTestSkipped('Requires Stripe configuration');

        $response = $this->actingAs($this->user)
            ->postJson('/payment/' . $this->booking->id . '/create-intent');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'clientSecret',
            'paymentId',
            'amount',
            'currency',
        ]);
    }

    public function test_paid_booking_cannot_create_new_payment(): void
    {
        // Create completed payment
        Payment::factory()->create([
            'booking_id' => $this->booking->id,
            'status' => PaymentStatus::Completed,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/payment/' . $this->booking->id . '/create-intent');

        $response->assertStatus(400);
        $response->assertJson(['error' => 'This booking has already been paid.']);
    }

    public function test_payment_success_redirects_to_confirmation(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/payment/' . $this->booking->id . '/success');

        $response->assertRedirect(route('booking.confirmation', $this->booking));
    }

    public function test_payment_failed_shows_error_page(): void
    {
        $response = $this->actingAs($this->user)
            ->get('/payment/' . $this->booking->id . '/failed?error=Card declined');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Booking/PaymentFailed')
            ->where('error', 'Card declined')
        );
    }

    public function test_confirmation_page_shows_booking_details(): void
    {
        $this->booking->update(['status' => 'confirmed']);

        $response = $this->actingAs($this->user)
            ->get('/book/' . $this->booking->id . '/confirmation');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Booking/Confirmation')
            ->has('booking')
        );
    }
}
