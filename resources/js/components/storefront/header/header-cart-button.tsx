import { Link, usePage } from '@inertiajs/react';
import {
    SF_HEADER_ICON_PILL,
    SF_HEADER_ICON_PILL_CART,
} from '@/components/storefront/header/header-icon-pill';
import { HEADER_ASSETS } from '@/lib/header-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type PageProps = {
    cartCount?: number;
};

type Props = {
    className?: string;
};

export function HeaderCartButton({ className }: Props) {
    const { cartCount = 0 } = usePage<PageProps>().props;

    return (
        <Link
            href={route('customer.cart')}
            className={cn(SF_HEADER_ICON_PILL, SF_HEADER_ICON_PILL_CART, 'relative', className)}
            aria-label="Mon panier"
        >
            <img
                src={HEADER_ASSETS.iconCart}
                alt=""
                width={20}
                height={22}
                className="h-[21.667px] w-5 object-contain"
            />
            {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#0059DD] px-1 text-[10px] font-semibold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            ) : null}
        </Link>
    );
}
