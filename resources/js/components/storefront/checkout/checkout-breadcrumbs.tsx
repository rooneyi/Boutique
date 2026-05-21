import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import { route } from '@/lib/route';

export function CheckoutBreadcrumbs() {
    return (
        <StorefrontBreadcrumbs
            className="rounded-[20px] p-2 sm:p-4"
            items={[
                { label: 'Accueil', href: route('home') },
                { label: 'Panier', href: route('customer.cart') },
                { label: 'Commande' },
            ]}
        />
    );
}
