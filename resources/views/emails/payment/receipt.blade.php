@component('mail::message')
# Payment Receipt

Hello {{ $booking->contact_name }},

Thank you for your payment. Here's your receipt for booking **{{ $booking->reference }}**.

@component('mail::panel')
### Payment Confirmed ✓

**Amount Paid:** {{ $formattedAmount }}<br>
**Payment Date:** {{ $paidAt }}<br>
**Payment ID:** {{ $payment->id }}
@endcomponent

## Booking Summary

**Activity:** {{ $activity->title }}<br>
**Reference:** {{ $booking->reference }}<br>
**Participants:** {{ $booking->total_participants }} {{ $booking->total_participants > 1 ? 'people' : 'person' }}

@component('mail::table')
| Description | Amount |
|:------------|-------:|
| Activity Fee | Rp {{ number_format(($booking->subtotal ?? 0) - ($booking->service_fee ?? 0), 0, ',', '.') }} |
| Service Fee | Rp {{ number_format($booking->service_fee ?? 0, 0, ',', '.') }} |
| **Total Paid** | **{{ $formattedAmount }}** |
@endcomponent

@component('mail::button', ['url' => config('app.url') . '/dashboard/bookings/' . $booking->id])
View Booking Details
@endcomponent

Keep this email for your records. If you have any questions about this charge, please contact us.

Thank you for choosing BaliokaTravel!<br>
**The BaliokaTravel Team** 🌴
@endcomponent
