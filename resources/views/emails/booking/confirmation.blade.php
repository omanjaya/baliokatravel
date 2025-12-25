@component('mail::message')
# Booking Confirmed! 🎉

Hello {{ $booking->contact_name }},

Great news! Your booking has been confirmed. Get ready for an amazing adventure in Bali!

## Booking Details

**Reference:** {{ $booking->reference }}

@component('mail::panel')
### {{ $activity->title }}

📍 **Location:** {{ $activity->area?->name ?? 'Bali' }}
📅 **Date:** {{ $formattedDate }}
⏰ **Time:** {{ $formattedTime }}
👥 **Participants:** {{ $booking->total_participants }} {{ $booking->total_participants > 1 ? 'people' : 'person' }}
@endcomponent

## Payment Summary

| Item | Amount |
|:-----|-------:|
| Subtotal | Rp {{ number_format($booking->subtotal ?? 0, 0, ',', '.') }} |
| Service Fee | Rp {{ number_format($booking->service_fee ?? 0, 0, ',', '.') }} |
| **Total** | **{{ $formattedTotal }}** |

## What's Next?

1. **Check your inbox** - We've sent you a detailed voucher
2. **Prepare for adventure** - Pack accordingly for your activity
3. **Arrive early** - Be at the meeting point 15 minutes before start time

@if($activity->meeting_point)
## Meeting Point

📍 {{ $activity->meeting_point }}

@if($activity->meeting_point_instructions)
{{ $activity->meeting_point_instructions }}
@endif
@endif

@component('mail::button', ['url' => config('app.url') . '/dashboard/bookings/' . $booking->id])
View Booking Details
@endcomponent

If you have any questions, please don't hesitate to contact us.

Have an amazing time!<br>
**The BaliokaTravel Team** 🌴
@endcomponent
