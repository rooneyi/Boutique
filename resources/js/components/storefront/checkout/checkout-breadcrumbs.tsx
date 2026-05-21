import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import type { CheckoutStep } from '@/components/storefront/checkout/checkout-form-data';
import { route } from '@/lib/route';

type Props = {
    step: CheckoutStep;
};

export function CheckoutBreadcrumbs({ step }: Props) {
    const items =
        step === 'shipping'
            ? [
                  { label: 'Accueil', href: route('home') },
                  { label: 'Panier', href: route('customer.cart') },
                  { label: 'Livraison' },
              ]
            : [
                  { label: 'Accueil', href: route('home') },
                  { label: 'Panier', href: route('customer.cart') },
                  { label: 'Livraison', href: route('customer.checkout') },
                  { label: 'Paiement' },
              ];

    return (
        <StorefrontBreadcrumbs
            className="rounded-[20px] p-2 sm:p-4"
            items={items}
        />
    );
}
