import { Link } from '@inertiajs/react';
import {
    SF_HEADER_ICON_PILL,
    SF_HEADER_ICON_PILL_HEART,
} from '@/components/storefront/header/header-icon-pill';
import { HEADER_ASSETS } from '@/lib/header-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

export function HeaderFavoritesButton({ className }: Props) {
    return (
        <Link
            href={route('customer.favorites.index')}
            className={cn(SF_HEADER_ICON_PILL, SF_HEADER_ICON_PILL_HEART, className)}
            aria-label="Mes favoris"
        >
            <img
                src={HEADER_ASSETS.iconHeart}
                alt=""
                width={22}
                height={19}
                className="h-[18.716px] w-[21.5px] object-contain"
            />
        </Link>
    );
}
