import { ChevronLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
    back?: { label: string; href: string };
};

export function AdminPageHeader({ title, description, actions, back }: Props) {
    return (
        <div
            className={cn(
                'flex flex-col gap-3',
                actions && 'sm:flex-row sm:items-start sm:justify-between',
            )}
        >
            <div className="space-y-1.5">
                {back && (
                    <Link
                        href={back.href}
                        className="mb-1 inline-flex items-center gap-1 font-poppins text-xs font-medium text-slate-400 transition-colors hover:text-[#0059DD]"
                    >
                        <ChevronLeft className="size-3" strokeWidth={2.5} />
                        {back.label}
                    </Link>
                )}
                <h1 className="font-poppins text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                    {title}
                </h1>
                {description && (
                    <p className="font-poppins text-sm text-slate-500 sm:text-base">
                        {description}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}
