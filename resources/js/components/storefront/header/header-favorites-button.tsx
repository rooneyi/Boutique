import { Link, usePage } from '@inertiajs/react';
import { Heart } from 'lucide-react';
import { SF_HEADER_ICON_PILL } from '@/components/storefront/header/header-icon-pill';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type PageProps = {
    url?: string;
};

type Props = {
    className?: string;
};

export function HeaderFavoritesButton({ className }: Props) {
    const { url } = usePage<PageProps>().props;
    const isFavoritesPage = (url ?? '').split('?')[0] === route('customer.favorites.index');

    return (
        <Link
            href={route('customer.favorites.index')}
            className={cn(
                SF_HEADER_ICON_PILL,
                isFavoritesPage && 'border-[#0059DD] bg-[#0059DD]/5',
                className,
            )}
            aria-label="Mes favoris"
            aria-current={isFavoritesPage ? 'page' : undefined}
        >
            <Heart
                className={cn(
                    'size-5',
                    isFavoritesPage ? 'fill-[#0059DD] text-[#0059DD]' : 'text-[#dc0000]',
                )}
                strokeWidth={1.25}
            />
        </Link>
    );
}
