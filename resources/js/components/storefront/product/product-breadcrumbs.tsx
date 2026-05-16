import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { route } from '@/lib/route';

type Props = {
    productName: string;
};

export function ProductBreadcrumbs({ productName }: Props) {
    return (
        <nav
            className="flex flex-wrap items-center gap-2.5 px-4 py-4 font-poppins text-base font-medium sm:px-14"
            aria-label="Fil d'Ariane"
        >
            <Link
                href={route('home')}
                className="text-[#5B5E64]/60 transition-colors hover:text-black"
            >
                Accueil
            </Link>
            <ChevronRight className="size-5 rotate-180 text-[#5B5E64]/60" aria-hidden />
            <Link
                href={route('customer.products.index')}
                className="text-[#5B5E64]/60 transition-colors hover:text-black"
            >
                Collection
            </Link>
            <ChevronRight className="size-5 rotate-180 text-[#5B5E64]/60" aria-hidden />
            <span className="text-black">{productName}</span>
        </nav>
    );
}
