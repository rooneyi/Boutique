import { usePage } from '@inertiajs/react';
import {
    HeaderIconPill,
    SF_HEADER_ICON_IMG_ACTIVE,
    SF_HEADER_ICON_PILL_CART,
} from '@/components/storefront/header/header-icon-pill';
import { HEADER_ASSETS } from '@/lib/header-assets';
import { cn } from '@/lib/utils';

type PageProps = {
    cartCount?: number;
};

type Props = {
    className?: string;
    active?: boolean;
    onClick?: () => void;
};

export function HeaderCartButton({ className, active = false, onClick }: Props) {
    const { cartCount = 0 } = usePage<PageProps>().props;

    return (
        <HeaderIconPill
            aria-label="Mon panier"
            className={cn(SF_HEADER_ICON_PILL_CART, 'relative', className)}
            active={active}
            onClick={onClick}
        >
            <img
                src={HEADER_ASSETS.iconCart}
                alt=""
                width={20}
                height={22}
                className={cn(
                    'h-[21.667px] w-5 object-contain transition-[filter] duration-200',
                    active && SF_HEADER_ICON_IMG_ACTIVE,
                )}
            />
            {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#0059DD] px-1 text-[10px] font-semibold leading-none text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                </span>
            ) : null}
        </HeaderIconPill>
    );
}
