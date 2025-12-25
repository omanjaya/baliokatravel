import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/stores/bookingStore';
import { bookingsApi } from '@/api';
import type { Activity, Availability } from '@/types';
import { format } from 'date-fns';

/**
 * Hook for managing booking flow
 */
export function useBooking() {
    const store = useBookingStore();
    const navigate = useNavigate();

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
        const params = new URLSearchParams({
            date: format(date, 'yyyy-MM-dd'),
            adults: adults.toString(),
            children: children.toString(),
        });
        navigate(`/book/${activity.slug}?${params.toString()}`);
    }, [navigate]);

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
            const response = await bookingsApi.create({
                activity_id: activityId,
                availability_id: availabilityId,
                participants: {
                    adults: data.adults,
                    children: data.children,
                },
                contact_name: data.contactName,
                contact_email: data.contactEmail,
                contact_phone: data.contactPhone,
                special_requests: data.specialRequests,
            });

            store.setStep('payment');
            return response;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Booking failed';
            store.setError(errorMessage);
            throw error;
        } finally {
            store.setProcessing(false);
        }
    }, []);

    /**
     * Cancel current booking flow
     */
    const cancelBooking = useCallback(() => {
        store.reset();
        navigate('/');
    }, [navigate]);

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
