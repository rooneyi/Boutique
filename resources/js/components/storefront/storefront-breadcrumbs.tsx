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
                'flex flex-wrap items-center gap-2.5 font-poppins text-base font-medium',
                className,
            )}
            aria-label="Fil d'Ariane"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="inline-flex min-w-0 items-center gap-2.5">
                        {index > 0 ? (
                            <ChevronRight
                                className="size-5 shrink-0 rotate-180 text-[#5B5E64]/60"
                                aria-hidden
                            />
                        ) : null}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="text-[#5B5E64]/60 transition-colors hover:text-black"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    'truncate',
                                    isLast ? 'text-black' : 'text-[#5B5E64]/60',
                                )}
                            >
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
