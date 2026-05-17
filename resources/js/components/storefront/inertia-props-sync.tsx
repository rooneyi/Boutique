import { usePage } from '@inertiajs/react';
import { syncStorefrontPageProps } from '@/lib/storefront-page-props';

/** À placer sous une page Inertia (header, layout) pour alimenter les tiroirs panier / favoris. */
export function InertiaPropsSync() {
    const { props } = usePage();
    syncStorefrontPageProps(props as Parameters<typeof syncStorefrontPageProps>[0]);

    return null;
}
