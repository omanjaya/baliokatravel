<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'content' => ['required', 'string', 'min:20', 'max:2000'],
            'title' => ['nullable', 'string', 'max:100'],
            'booking_id' => ['nullable', 'uuid', 'exists:bookings,id'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'rating.required' => 'Please select a rating.',
            'rating.min' => 'Rating must be at least 1 star.',
            'rating.max' => 'Rating cannot exceed 5 stars.',
            'content.required' => 'Please write a review.',
            'content.min' => 'Review must be at least 20 characters.',
            'content.max' => 'Review cannot exceed 2000 characters.',
            'photos.max' => 'You can upload up to 5 photos.',
            'photos.*.max' => 'Each photo must be less than 5MB.',
        ];
    }
}
