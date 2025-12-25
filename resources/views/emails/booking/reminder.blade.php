@component('mail::message')
# See You Tomorrow! 🌴

Hello {{ $booking->contact_name }},

This is a friendly reminder that your Bali adventure is **tomorrow**!

@component('mail::panel')
### {{ $activity->title }}

📅 **Date:** {{ $formattedDate }}
⏰ **Time:** {{ $formattedTime }}
📍 **Meeting Point:** {{ $meetingPoint }}
@endcomponent

## Don't Forget to Bring

- ✅ This confirmation email or your booking reference: **{{ $booking->reference }}**
- ✅ Valid ID/Passport
- ✅ Comfortable clothing & shoes
- ✅ Sunscreen & hat
- ✅ Camera for amazing photos!

## Need Help?

If you have any questions or need to make changes, please contact us immediately.

@component('mail::button', ['url' => config('app.url') . '/dashboard/bookings/' . $booking->id])
View Booking
@endcomponent

We can't wait to see you tomorrow!

Best regards,<br>
**The BaliokaTravel Team** 🌴
@endcomponent
