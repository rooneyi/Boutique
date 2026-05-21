import { cn } from '@/lib/utils';

export type AdminBadgeVariant =
    | 'blue'
    | 'dark'
    | 'outline'
    | 'danger'
    | 'muted'
    | 'warning';

const VARIANT_CLASS: Record<AdminBadgeVariant, string> = {
    blue: 'border-[#0059DD]/15 bg-[#0059DD]/10 text-[#0059DD]',
    dark: 'border-neutral-200 bg-neutral-100 text-neutral-600',
    outline: 'border-neutral-200 bg-neutral-50 text-neutral-600',
    danger: 'border-[#dc0000]/15 bg-[#dc0000]/8 text-[#c40000]',
    muted: 'border-neutral-100 bg-neutral-50 text-[#8a8a8a]',
    warning: 'border-amber-200/80 bg-amber-50 text-amber-800/90',
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
    return 'muted';
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
                'font-poppins inline-flex shrink-0 items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-snug',
                VARIANT_CLASS[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
