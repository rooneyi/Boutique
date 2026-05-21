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
                  { label: 'Passer la commande' },
                  { label: 'Adresse de livraison' },
              ]
            : [
                  { label: 'Accueil', href: route('home') },
                  { label: 'Panier', href: route('customer.cart') },
                  { label: 'Passer la commande', href: route('customer.checkout') },
                  { label: 'Adresse de livraison', href: route('customer.checkout') },
                  { label: 'Paiement' },
              ];

    return (
        <StorefrontBreadcrumbs
            className="font-poppins text-base font-medium text-[rgba(91,94,100,0.62)]"
            items={items}
        />
    );
}
