import { Link, usePage } from '@inertiajs/react';
import headerCartIcon from '../../../../media/header-cart-icon.svg';
import { route } from '@/lib/route';
import { SF_HEADER_ICON_PILL } from '@/components/storefront/header/header-icon-pill';
import { cn } from '@/lib/utils';

type PageProps = {
    cartCount?: number;
    url?: string;
};

type Props = {
    className?: string;
};

export function HeaderCartButton({ className }: Props) {
    const { cartCount = 0, url } = usePage<PageProps>().props;
    const isCartPage = (url ?? '').split('?')[0] === route('customer.cart');

    return (
        <Link
            href={route('customer.cart')}
            className={cn(
                SF_HEADER_ICON_PILL,
                'relative px-2.5 py-2',
                isCartPage && 'border-[#0059DD] ring-1 ring-[#0059DD]/20',
                className,
            )}
            aria-label="Mon panier"
        >
            <img
                src={headerCartIcon}
                alt=""
                width={20}
                height={22}
                className="size-5 object-contain"
            />
            {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#0059DD] px-1 text-[10px] font-semibold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            ) : null}
        </Link>
    );
}
