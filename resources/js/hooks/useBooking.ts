import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import { useBookingStore } from '@/stores/bookingStore';
import type { Activity, Availability } from '@/types';
import { format } from 'date-fns';

/**
 * Hook for managing booking flow
 */
export function useBooking() {
    const store = useBookingStore();

    /**
     * Initialize booking for an activity
     */
    const initBooking = useCallback((activity: Activity) => {
        store.reset();
        store.setActivity(activity);
    }, []);

    /**
     * Select availability (date/time slot)
     */
    const selectAvailability = useCallback((availability: Availability) => {
        store.setAvailability(availability);
        store.setStep('details');
    }, []);

    /**
     * Update participant count
     */
    const updateParticipants = useCallback((adults: number, children: number) => {
        store.setParticipants(adults, children);
    }, []);

    /**
     * Navigate to booking page
     */
    const startBooking = useCallback((
        activity: Activity,
        date: Date,
        adults: number,
        children: number
    ) => {
        router.get(`/book/${activity.slug}`, {
            date: format(date, 'yyyy-MM-dd'),
            adults,
            children,
        });
    }, []);

    /**
     * Submit booking form
     */
    const submitBooking = useCallback(async (
        activityId: string,
        availabilityId: string,
        data: {
            adults: number;
            children: number;
            contactName: string;
            contactEmail: string;
            contactPhone: string;
            specialRequests?: string;
        }
    ) => {
        store.setProcessing(true);
        store.setError(null);

        try {
            await router.post('/bookings', {
                activity_id: activityId,
                availability_id: availabilityId,
                adults: data.adults,
                children: data.children,
                contact_name: data.contactName,
                contact_email: data.contactEmail,
                contact_phone: data.contactPhone,
                special_requests: data.specialRequests,
            }, {
                onSuccess: () => {
                    store.setStep('payment');
                },
                onError: (errors) => {
                    store.setError(Object.values(errors)[0] as string || 'Booking failed');
                },
                onFinish: () => {
                    store.setProcessing(false);
                },
            });
        } catch (error) {
            store.setError('An unexpected error occurred');
            store.setProcessing(false);
        }
    }, []);

    /**
     * Cancel current booking flow
     */
    const cancelBooking = useCallback(() => {
        store.reset();
        router.visit('/');
    }, []);

    return {
        // State
        activity: store.activity,
        availability: store.availability,
        participants: store.participants,
        step: store.step,
        isProcessing: store.isProcessing,
        error: store.error,

        // Computed
        totalParticipants: store.getTotalParticipants(),
        subtotal: store.getSubtotal(),

        // Actions
        initBooking,
        selectAvailability,
        updateParticipants,
        startBooking,
        submitBooking,
        cancelBooking,
        setContactInfo: store.setContactInfo,
        setSpecialRequests: store.setSpecialRequests,
    };
}
