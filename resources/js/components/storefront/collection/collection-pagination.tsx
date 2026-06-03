import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links?: PaginationLink[];
    meta?: { current_page: number; last_page: number };
};

export function CollectionPagination({ links, meta }: Props) {
    if (!meta || meta.last_page <= 1) {
        return null;
    }

    const pageLinks =
        links?.filter(
            (l) =>
                l.label &&
                !l.label.includes('Previous') &&
                !l.label.includes('Next') &&
                !l.label.includes('Précédent') &&
                !l.label.includes('Suivant') &&
                !l.label.includes('...'),
        ) ?? [];

    const prev = links?.find(
        (l) =>
            l.label.includes('Previous') ||
            l.label.includes('Précédent') ||
            l.label.includes('&laquo;'),
    );
    const next = links?.find(
        (l) =>
            l.label.includes('Next') ||
            l.label.includes('Suivant') ||
            l.label.includes('&raquo;'),
    );

    return (
        <nav
            className="flex items-center justify-between px-[19px]"
            aria-label="Pagination"
        >
            {prev?.url ? (
                <Button
                    variant="outline"
                    size="icon"
                    className="size-[39.5px] shrink-0 rounded-full border-neutral-300"
                    asChild
                >
                    <Link href={prev.url} preserveScroll>
                        <ChevronLeft className="size-5" />
                    </Link>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    className="size-[39.5px] shrink-0 rounded-full border-neutral-300"
                    disabled
                >
                    <ChevronLeft className="size-5" />
                </Button>
            )}

            <div className="flex flex-1 items-center justify-center gap-2.5">
                {pageLinks.map((link, i) => {
                    const pageNum = link.label.replace(/<[^>]+>/g, '').trim();
                    if (!link.url) {
                        return (
                            <span
                                key={i}
                                className="flex items-center justify-center px-2.5 py-1.5 font-poppins text-sm font-medium text-neutral-400"
                            >
                                {pageNum}
                            </span>
                        );
                    }
                    return (
                        <Link
                            key={i}
                            href={link.url}
                            preserveScroll
                            className={cn(
                                'flex items-center justify-center rounded-[3px] px-2.5 py-1.5 font-poppins text-sm font-medium transition-colors',
                                link.active
                                    ? 'bg-[#e6e6e6] text-black'
                                    : 'text-black hover:bg-neutral-100',
                            )}
                        >
                            {pageNum}
                        </Link>
                    );
                })}
            </div>

            {next?.url ? (
                <Button
                    variant="outline"
                    size="icon"
                    className="size-[39.5px] shrink-0 rounded-full border-neutral-300"
                    asChild
                >
                    <Link href={next.url} preserveScroll>
                        <ChevronRight className="size-5" />
                    </Link>
                </Button>
            ) : (
                <Button
                    variant="outline"
                    size="icon"
                    className="size-[39.5px] shrink-0 rounded-full border-neutral-300"
                    disabled
                >
                    <ChevronRight className="size-5" />
                </Button>
            )}
        </nav>
    );
}
