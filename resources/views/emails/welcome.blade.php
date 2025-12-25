@component('mail::message')
# Welcome to BaliokaTravel! 🌴

Hello {{ $name }},

Thank you for joining **BaliokaTravel** - your gateway to amazing Bali adventures!

We're thrilled to have you as part of our community. Here's what you can do now:

## Explore Amazing Activities

From sunrise treks on Mount Batur to serene rice terrace walks, discover hundreds of unique experiences across Bali.

@component('mail::button', ['url' => config('app.url') . '/search'])
Browse Activities
@endcomponent

## Why Choose BaliokaTravel?

- ✅ **Verified Local Suppliers** - All our partners are carefully vetted
- ✅ **Best Price Guarantee** - Competitive prices with no hidden fees
- ✅ **Instant Confirmation** - Book now, get confirmed instantly
- ✅ **24/7 Support** - We're here when you need us

## Popular Destinations

- **Ubud** - Art, culture & rice terraces
- **Seminyak** - Beaches & nightlife
- **Nusa Penida** - Stunning cliffs & snorkeling
- **Uluwatu** - Temples & surfing
- **Canggu** - Digital nomad paradise

@component('mail::panel')
**Pro Tip:** Book early for the best availability, especially during peak season (June-August & December)!
@endcomponent

Have questions? Just reply to this email - we'd love to help!

Welcome aboard,<br>
**The BaliokaTravel Team** 🌴

---

*PS: Follow us on social media for the latest deals and Bali travel tips!*
@endcomponent
