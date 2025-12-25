import apiClient, { ApiResponse } from './client';
import type { User } from '../types';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authApi = {
    // Login
    login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.data.token) {
            localStorage.setItem('auth_token', response.data.data.token);
        }
        return response.data;
    },

    // Register
    register: async (data: RegisterData): Promise<ApiResponse<AuthResponse>> => {
        const response = await apiClient.post('/auth/register', data);
        if (response.data.data.token) {
            localStorage.setItem('auth_token', response.data.data.token);
        }
        return response.data;
    },

    // Logout
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
        localStorage.removeItem('auth_token');
    },

    // Get current user
    getUser: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get('/auth/user');
        return response.data;
    },

    // Update profile
    updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
        const response = await apiClient.put('/auth/profile', data);
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email: string): Promise<ApiResponse<{ message: string }>> => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    }): Promise<ApiResponse<{ message: string }>> => {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    },
};

export default authApi;
