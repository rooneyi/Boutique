import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Pilule icône navbar — Figma 122-2184 (#bfbfbf, rounded 25px) */
export const SF_HEADER_ICON_PILL =
    'inline-flex shrink-0 items-center justify-center rounded-[25px] border border-[#bfbfbf] bg-white transition-all duration-200 hover:border-[#0059DD] hover:bg-[#0059DD]/8';

export const SF_HEADER_ICON_PILL_ACTIVE =
    'border-[#0059DD] bg-[#0059DD] hover:bg-[#0047b0]';

/** Icône blanche quand la pilule est active (fond bleu) */
export const SF_HEADER_ICON_IMG_ACTIVE =
    'brightness-0 invert';

export const SF_HEADER_ICON_PILL_BELL =
    'px-[10.5px] py-[9px]';

export const SF_HEADER_ICON_PILL_HEART =
    'px-2 py-[9.5px]';

export const SF_HEADER_ICON_PILL_CART =
    'px-[10.5px] py-[9px]';

type Props = {
    children: ReactNode;
    className?: string;
    href?: string;
    onClick?: () => void;
    active?: boolean;
    'aria-label': string;
    'aria-pressed'?: boolean;
};

export function HeaderIconPill({
    children,
    className,
    href,
    onClick,
    active = false,
    'aria-label': ariaLabel,
    'aria-pressed': ariaPressed,
}: Props) {
    const classes = cn(
        SF_HEADER_ICON_PILL,
        active && SF_HEADER_ICON_PILL_ACTIVE,
        className,
    );

    if (href) {
        return (
            <Link
                href={href}
                className={classes}
                aria-label={ariaLabel}
                aria-current={active ? 'page' : undefined}
            >
                {children}
            </Link>
        );
    }

    return (
        <button
            type="button"
            className={classes}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-pressed={ariaPressed ?? active}
        >
            {children}
        </button>
    );
}
