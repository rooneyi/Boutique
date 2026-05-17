import { cn } from '@/lib/utils';

export type AdminBadgeVariant =
    | 'blue'
    | 'dark'
    | 'outline'
    | 'danger'
    | 'muted'
    | 'warning';

const VARIANT_CLASS: Record<AdminBadgeVariant, string> = {
    blue: 'border-transparent bg-[#0059DD] text-white',
    dark: 'border-black bg-black text-white',
    outline: 'border-black bg-white text-black',
    danger: 'border-transparent bg-[#dc0000] text-white',
    muted: 'border-neutral-300 bg-white text-[#747474] font-medium',
    warning: 'border-black bg-white text-black',
};

type Props = React.ComponentProps<'span'> & {
    variant?: AdminBadgeVariant;
};

export function orderStatusBadgeVariant(status: string): AdminBadgeVariant {
    const s = status.toLowerCase();
    if (s.includes('livr') || s.includes('deliver') || s.includes('complet')) {
        return 'blue';
    }
    if (s.includes('annul') || s.includes('cancel')) {
        return 'danger';
    }
    if (s.includes('attent') || s.includes('pend')) {
        return 'warning';
    }
    return 'outline';
}

export function customerSegmentBadgeVariant(
    segment: 'frequent' | 'active' | 'inactive' | 'never_ordered',
): AdminBadgeVariant {
    switch (segment) {
        case 'frequent':
            return 'blue';
        case 'inactive':
        case 'never_ordered':
            return 'muted';
        default:
            return 'outline';
    }
}

export function AdminBadge({
    variant = 'blue',
    className,
    children,
    ...props
}: Props) {
    return (
        <span
            className={cn(
                'font-poppins inline-flex shrink-0 items-center justify-center rounded-full border px-3.5 py-1.5 text-[13px] font-semibold leading-none',
                VARIANT_CLASS[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
