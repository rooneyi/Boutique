import { Link } from '@inertiajs/react';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type Props = {
    /** Fond clair (navbar) → logo noir ; fond sombre → logo blanc */
    variant?: 'on-light' | 'on-dark';
    href?: string;
    className?: string;
    size?: number;
};

export function StorefrontLogo({
    variant = 'on-light',
    href = route('home'),
    className,
    size = 49,
}: Props) {
    const src = variant === 'on-light' ? HOME_ASSETS.logoDark : HOME_ASSETS.logo;

    const image = (
        <img
            src={src}
            alt="PCJ"
            width={size}
            height={size}
            className={cn('object-contain', className)}
            style={{ width: size, height: size }}
        />
    );

    if (!href) {
        return image;
    }

    return (
        <Link href={href} className="flex shrink-0 items-center" aria-label="Accueil PCJ">
            {image}
        </Link>
    );
}
