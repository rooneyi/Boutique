import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const SF_HEADER_ICON_PILL =
    'inline-flex size-[37px] shrink-0 items-center justify-center rounded-[25px] border-[0.5px] border-[#bfbfbf] bg-white transition-colors hover:bg-neutral-50';

type Props = {
    children: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
    'aria-label': string;
    active?: boolean;
};

export function HeaderIconPill({ children, className, href, onClick, 'aria-label': ariaLabel, active }: Props) {
    const classes = cn(SF_HEADER_ICON_PILL, active && 'border-[#0059DD] bg-[#0059DD]/5', className);

    if (href) {
        return (
            <Link href={href} className={classes} aria-label={ariaLabel}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes} onClick={onClick} aria-label={ariaLabel}>
            {children}
        </button>
    );
}
