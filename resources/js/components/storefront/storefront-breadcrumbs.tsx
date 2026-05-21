import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

type Props = {
    items: BreadcrumbItem[];
    className?: string;
};

export function StorefrontBreadcrumbs({ items, className }: Props) {
    return (
        <nav
            className={cn(
                'flex flex-wrap items-center gap-1 font-poppins text-[13px] font-medium text-[#5b5e64]',
                className,
            )}
            aria-label="Fil d'Ariane"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                        {index > 0 ? (
                            <ChevronRight className="size-4 shrink-0 text-[#5b5e64]/60" aria-hidden />
                        ) : null}
                        {item.href && !isLast ? (
                            <Link href={item.href} className="hover:text-black">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? 'text-black' : undefined}>{item.label}</span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
