import apiClient, { ApiResponse, PaginatedResponse } from './client';
import type { Booking, Payment } from '../types';

export interface CreateBookingData {
    activity_id: string;
    availability_id: string;
    participants: {
        adults: number;
        children: number;
    };
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
    special_requests?: string;
}

export interface PaymentIntentResponse {
    client_secret: string;
    amount: number;
    currency: string;
}

export const bookingsApi = {
    // Create a new booking
    create: async (data: CreateBookingData): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.post('/bookings', data);
        return response.data;
    },

    // Get booking by reference
    getByReference: async (reference: string): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.get(`/bookings/${reference}`);
        return response.data;
    },

    // Get user's bookings
    getMyBookings: async (page = 1): Promise<PaginatedResponse<Booking>> => {
        const response = await apiClient.get(`/bookings?page=${page}`);
        return response.data;
    },

    // Cancel booking
    cancel: async (reference: string): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.post(`/bookings/${reference}/cancel`);
        return response.data;
    },

    // Create payment intent for Stripe
    createPaymentIntent: async (bookingId: string): Promise<ApiResponse<PaymentIntentResponse>> => {
        const response = await apiClient.post(`/bookings/${bookingId}/payment-intent`);
        return response.data;
    },

    // Confirm payment
    confirmPayment: async (bookingId: string, paymentIntentId: string): Promise<ApiResponse<Payment>> => {
        const response = await apiClient.post(`/bookings/${bookingId}/confirm-payment`, {
            payment_intent_id: paymentIntentId,
        });
        return response.data;
    },
};

export default bookingsApi;
