import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import { route } from '@/lib/route';

type Props = {
    productName: string;
};

export function ProductBreadcrumbs({ productName }: Props) {
    return (
        <div className="px-4 py-4 sm:px-14">
            <StorefrontBreadcrumbs
                items={[
                    { label: 'Accueil', href: route('home') },
                    { label: 'Collection', href: route('customer.products.index') },
                    { label: productName },
                ]}
            />
        </div>
    );
}
