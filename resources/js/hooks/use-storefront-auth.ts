import { usePage } from '@inertiajs/react';
import { getStorefrontAuthUser } from '@/lib/storefront-page-props';

type AuthUser = {
    id: number;
    name?: string;
    email?: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
};

/** Auth utilisable dans les pages Inertia et dans les tiroirs (hors PageContext). */
export function useStorefrontAuth(): AuthUser | null | undefined {
    try {
        return usePage<PageProps>().props.auth?.user;
    } catch {
        return getStorefrontAuthUser();
    }
}
