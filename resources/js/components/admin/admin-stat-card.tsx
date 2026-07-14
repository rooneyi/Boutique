import { LucideIcon } from 'lucide-react';
import { ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    icon: LucideIcon;
    accent?: boolean;
};

export function AdminStatCard({ label, value, hint, icon: Icon, accent }: Props) {
    return (
        <div className="flex h-full min-h-[7.5rem] flex-col rounded-sm border border-neutral-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <p className="font-poppins text-xs font-semibold uppercase tracking-wide text-[#747474]">
                    {label}
                </p>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#0059DD]/20 bg-[#0059DD]/10">
                    <Icon className="size-4 text-[#0059DD]" strokeWidth={1.5} />
                </span>
            </div>
            <p
                className={cn(
                    'mt-3 font-poppins text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.75rem]',
                    accent ? 'text-[#0059DD]' : 'text-black',
                )}
            >
                {value}
            </p>
            {hint ? (
                <p className={cn(ADMIN_MUTED, 'mt-auto pt-2 text-xs leading-snug')}>{hint}</p>
            ) : null}
        </div>
    );
}
