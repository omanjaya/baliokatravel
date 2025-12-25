import { create } from 'zustand';
import type { Activity, Availability } from '@/types';

interface ParticipantsData {
    adults: number;
    children: number;
}

interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

interface BookingState {
    // Data
    activity: Activity | null;
    availability: Availability | null;
    participants: ParticipantsData;
    contactInfo: ContactInfo;
    specialRequests: string;

    // UI State
    step: 'select' | 'details' | 'payment' | 'confirmation';
    isProcessing: boolean;
    error: string | null;

    // Actions
    setActivity: (activity: Activity) => void;
    setAvailability: (availability: Availability | null) => void;
    setParticipants: (adults: number, children: number) => void;
    setContactInfo: (info: Partial<ContactInfo>) => void;
    setSpecialRequests: (requests: string) => void;
    setStep: (step: BookingState['step']) => void;
    setProcessing: (processing: boolean) => void;
    setError: (error: string | null) => void;

    // Computed
    getTotalParticipants: () => number;
    getSubtotal: () => number;

    // Reset
    reset: () => void;
}

const initialState = {
    activity: null,
    availability: null,
    participants: { adults: 2, children: 0 },
    contactInfo: { name: '', email: '', phone: '' },
    specialRequests: '',
    step: 'select' as const,
    isProcessing: false,
    error: null,
};

export const useBookingStore = create<BookingState>((set, get) => ({
    ...initialState,

    setActivity: (activity) => set({ activity }),

    setAvailability: (availability) => set({ availability }),

    setParticipants: (adults, children) =>
        set({ participants: { adults, children } }),

    setContactInfo: (info) =>
        set((state) => ({
            contactInfo: { ...state.contactInfo, ...info }
        })),

    setSpecialRequests: (specialRequests) => set({ specialRequests }),

    setStep: (step) => set({ step }),

    setProcessing: (isProcessing) => set({ isProcessing }),

    setError: (error) => set({ error }),

    getTotalParticipants: () => {
        const { participants } = get();
        return participants.adults + participants.children;
    },

    getSubtotal: () => {
        const { activity, participants } = get();
        if (!activity) return 0;

        const adultPrice = activity.price_idr;
        const childPrice = activity.child_price_idr || Math.round(activity.price_idr * 0.7);

        return (participants.adults * adultPrice) + (participants.children * childPrice);
    },

    reset: () => set(initialState),
}));

// Selector hooks for better performance
export const useBookingActivity = () => useBookingStore((state) => state.activity);
export const useBookingAvailability = () => useBookingStore((state) => state.availability);
export const useBookingParticipants = () => useBookingStore((state) => state.participants);
export const useBookingStep = () => useBookingStore((state) => state.step);
export const useBookingError = () => useBookingStore((state) => state.error);
