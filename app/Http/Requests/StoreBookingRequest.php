<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Allow both guests and authenticated users
    }

    public function rules(): array
    {
        return [
            'activity_id' => ['required', 'uuid', 'exists:activities,id'],
            'availability_id' => ['required', 'uuid', 'exists:activity_availabilities,id'],
            'adults' => ['required', 'integer', 'min:1', 'max:20'],
            'children' => ['nullable', 'integer', 'min:0', 'max:10'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'email', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20'],
            'special_requests' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'activity_id.required' => 'Please select an activity.',
            'activity_id.exists' => 'The selected activity is not available.',
            'availability_id.required' => 'Please select a date and time.',
            'availability_id.exists' => 'The selected time slot is not available.',
            'adults.required' => 'At least 1 adult is required.',
            'adults.min' => 'At least 1 adult is required.',
            'contact_name.required' => 'Please enter your name.',
            'contact_email.required' => 'Please enter your email.',
            'contact_email.email' => 'Please enter a valid email address.',
            'contact_phone.required' => 'Please enter your phone number.',
        ];
    }
}
