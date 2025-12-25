import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';

/**
 * Hook to access authenticated user data
 */
export function useAuth() {
    const { user, isAuthenticated, logout } = useAuthStore();

    return {
        user,
        isAuthenticated,
        isAdmin: user?.role === 'admin',
        isSupplier: user?.role === 'supplier',
        isTraveler: user?.role === 'traveler',
        logout,
    };
}

/**
 * Hook to check if current user has specific role
 */
export function useHasRole(role: User['role']): boolean {
    const { user } = useAuth();
    return user?.role === role;
}

/**
 * Hook to require authentication - redirects if not logged in
 */
export function useRequireAuth() {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        // Typically handled by middleware, but useful for client-side checks
        return { isAuthenticated: false, user: null };
    }

    return { isAuthenticated: true, user };
}
