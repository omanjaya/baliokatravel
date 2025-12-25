<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AreaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::prefix('v1')->group(function () {
    // Activities
    Route::get('/activities', [ActivityController::class, 'index']);
    Route::get('/activities/featured', [ActivityController::class, 'featured']);
    Route::get('/activities/{slug}', [ActivityController::class, 'show']);
    Route::get('/activities/{slug}/availability', [ActivityController::class, 'availability']);
    Route::get('/activities/{slug}/reviews', [ActivityController::class, 'reviews']);

    // Areas
    Route::get('/areas', [AreaController::class, 'index']);
    Route::get('/areas/{slug}/activities', [AreaController::class, 'activities']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{slug}/activities', [CategoryController::class, 'activities']);

    // Auth
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Booking price calculation (public)
    Route::post('/activities/{activity}/calculate-price', [BookingController::class, 'calculatePrice']);
});

// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{reference}', [BookingController::class, 'show']);
    Route::post('/bookings/{reference}/cancel', [BookingController::class, 'cancel']);

    // Payments
    Route::post('/bookings/{bookingId}/payment-intent', [PaymentController::class, 'createIntent']);
    Route::post('/bookings/{bookingId}/confirm-payment', [PaymentController::class, 'confirmPayment']);
});

// Legacy API routes (without v1 prefix for backward compatibility)
Route::get('/activities', [ActivityController::class, 'index']);
Route::get('/activities/featured', [ActivityController::class, 'featured']);
Route::get('/activities/{slug}', [ActivityController::class, 'show']);
Route::get('/activities/{slug}/availability', [ActivityController::class, 'availability']);
Route::get('/activities/{slug}/reviews', [ActivityController::class, 'reviews']);
Route::get('/areas', [AreaController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{reference}', [BookingController::class, 'show']);
    Route::post('/bookings/{reference}/cancel', [BookingController::class, 'cancel']);
    Route::post('/bookings/{bookingId}/payment-intent', [PaymentController::class, 'createIntent']);
    Route::post('/bookings/{bookingId}/confirm-payment', [PaymentController::class, 'confirmPayment']);
});
