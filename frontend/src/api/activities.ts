import apiClient, { PaginatedResponse, ApiResponse } from './client';
import type { Activity, BaliArea, Category, Availability, Review } from '../types';

export interface SearchFilters {
    query?: string;
    area?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    date?: string;
    difficulty?: string;
    sort_by?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
    page?: number;
    per_page?: number;
}

export const activitiesApi = {
    // Get all activities with filters
    search: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Activity>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });
        const response = await apiClient.get(`/activities?${params.toString()}`);
        return response.data;
    },

    // Get featured activities for homepage
    getFeatured: async (limit = 6): Promise<ApiResponse<Activity[]>> => {
        const response = await apiClient.get(`/activities/featured?limit=${limit}`);
        return response.data;
    },

    // Get single activity by slug
    getBySlug: async (slug: string): Promise<ApiResponse<Activity>> => {
        const response = await apiClient.get(`/activities/${slug}`);
        return response.data;
    },

    // Get activity availability
    getAvailability: async (activityId: string, month?: string): Promise<ApiResponse<Availability[]>> => {
        const params = month ? `?month=${month}` : '';
        const response = await apiClient.get(`/activities/${activityId}/availability${params}`);
        return response.data;
    },

    // Get activity reviews
    getReviews: async (activityId: string, page = 1): Promise<PaginatedResponse<Review>> => {
        const response = await apiClient.get(`/activities/${activityId}/reviews?page=${page}`);
        return response.data;
    },

    // Get all areas
    getAreas: async (): Promise<ApiResponse<BaliArea[]>> => {
        const response = await apiClient.get('/areas');
        return response.data;
    },

    // Get all categories
    getCategories: async (): Promise<ApiResponse<Category[]>> => {
        const response = await apiClient.get('/categories');
        return response.data;
    },

    // Get activities by area
    getByArea: async (areaSlug: string, page = 1): Promise<PaginatedResponse<Activity>> => {
        const response = await apiClient.get(`/areas/${areaSlug}/activities?page=${page}`);
        return response.data;
    },

    // Get activities by category
    getByCategory: async (categorySlug: string, page = 1): Promise<PaginatedResponse<Activity>> => {
        const response = await apiClient.get(`/categories/${categorySlug}/activities?page=${page}`);
        return response.data;
    },
};

export default activitiesApi;
