import { Link } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { SF_HEADER_ICON_PILL } from '@/components/storefront/header/header-icon-pill';
import { SF_HEADER_HEART } from '@/lib/storefront-ui-styles';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

export function HeaderFavoritesButton({ className }: Props) {
    return (
        <Link
            href={route('customer.favorites.index')}
            className={cn(SF_HEADER_ICON_PILL, className)}
            aria-label="Mes favoris"
        >
            <Heart className={cn('size-5', SF_HEADER_HEART)} strokeWidth={1.25} />
        </Link>
    );
}
