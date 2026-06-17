import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    href?: string;
    method?: 'get' | 'post';
    className?: string;
};

export function AccountDrawerMenuItem({
    icon: Icon,
    label,
    onClick,
    href,
    method = 'get',
    className,
}: Props) {
    const content = (
        <>
            <span className="flex items-center gap-2.5">
                <Icon className="size-[34px] shrink-0 stroke-[1.25] text-black" aria-hidden />
                <span className="font-poppins text-2xl font-medium text-black">{label}</span>
            </span>
        </>
    );

    const rowClass = cn(
        'flex w-full items-center px-5 py-[18px] text-left transition-colors hover:bg-neutral-50',
        className,
    );

    if (href) {
        return (
            <Link href={href} method={method} className={rowClass} onClick={onClick}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" className={rowClass} onClick={onClick}>
            {content}
        </button>
    );
}
