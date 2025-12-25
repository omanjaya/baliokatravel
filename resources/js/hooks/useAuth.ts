import { usePage } from '@inertiajs/react';
import type { User, PageProps } from '@/types';

/**
 * Hook to access authenticated user data
 */
export function useAuth() {
    const { auth } = usePage<PageProps>().props;

    const user = auth?.user;

    return {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isSupplier: user?.role === 'supplier',
        isTraveler: user?.role === 'traveler',
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
