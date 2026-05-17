import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { route } from '@/lib/route';

export function CheckoutBreadcrumbs() {
    return (
        <nav
            className="flex flex-wrap items-center gap-2 rounded-[20px] p-4"
            aria-label="Fil d'Ariane"
        >
            <Link
                href={route('customer.cart')}
                className="font-poppins text-base font-medium text-[rgba(91,94,100,0.62)] hover:text-black"
            >
                Panier
            </Link>
            <ChevronRight className="size-6 text-[rgba(91,94,100,0.62)]" aria-hidden />
            <span className="font-poppins text-base font-medium text-[rgba(91,94,100,0.62)]">
                Commande
            </span>
        </nav>
    );
}
