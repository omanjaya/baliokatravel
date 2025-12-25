<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebhookController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/search', [ActivityController::class, 'search'])->name('search');
Route::get('/activities/{slug}', [ActivityController::class, 'show'])->name('activities.show');
Route::get('/areas/{area}', [AreaController::class, 'show'])->name('areas.show');

// API-like public routes
Route::post('/api/activities/{activity}/calculate-price', [BookingController::class, 'calculatePrice'])
    ->name('api.booking.calculate');

// Auth routes (Breeze)
require __DIR__.'/auth.php';

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // User Bookings
    Route::get('/dashboard/bookings', [BookingController::class, 'index'])->name('dashboard.bookings');
    Route::get('/dashboard/bookings/{booking}', [BookingController::class, 'show'])->name('dashboard.bookings.show');
    
    // Booking Flow
    Route::get('/book/{slug}', [BookingController::class, 'create'])->name('booking.create');
    Route::post('/book', [BookingController::class, 'store'])->name('booking.store');
    Route::get('/book/{booking}/payment', [BookingController::class, 'payment'])->name('booking.payment');
    Route::get('/book/{booking}/confirmation', [BookingController::class, 'confirmation'])->name('booking.confirmation');
    Route::post('/book/{booking}/cancel', [BookingController::class, 'cancel'])->name('booking.cancel');

    // Payment
    Route::post('/payment/{booking}/create-intent', [PaymentController::class, 'createIntent'])->name('payment.create-intent');
    Route::get('/payment/{booking}/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/{booking}/failed', [PaymentController::class, 'failed'])->name('payment.failed');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Reviews
    Route::get('/dashboard/reviews', [ReviewController::class, 'userReviews'])->name('dashboard.reviews');
    Route::get('/activities/{activity}/reviews/create', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('/activities/{activity}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::post('/reviews/{review}/helpful', [ReviewController::class, 'markHelpful'])->name('reviews.helpful');
});

// Webhooks (no CSRF)
Route::post('/webhooks/stripe', [WebhookController::class, 'stripe'])
    ->name('webhooks.stripe')
    ->withoutMiddleware(['web']);
