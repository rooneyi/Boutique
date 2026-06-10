type AuthUser = {
    id: number;
    name?: string;
    email?: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

export type StorefrontPageProps = {
    auth?: {
        user?: AuthUser | null;
    };
    canRegister?: boolean;
    cartCount?: number;
    favoritesCount?: number;
};

let cached: StorefrontPageProps = {};

/** Garde une copie des props Inertia pour les tiroirs rendus hors arbre Page. */
export function syncStorefrontPageProps(props: StorefrontPageProps): void {
    cached = props;
}

export function getStorefrontPageProps(): StorefrontPageProps {
    return cached;
}

export function getStorefrontAuthUser(): AuthUser | null | undefined {
    return cached.auth?.user;
}

export function getStorefrontCanRegister(): boolean {
    return cached.canRegister ?? false;
}
