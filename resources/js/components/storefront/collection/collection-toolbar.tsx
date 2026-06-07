import { router } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import { route } from '@/lib/route';

type Filters = {
    category: string;
    sort: string;
    min_price: number;
    max_price: number;
    price_filter_active?: boolean;
    q?: string;
    color?: string;
};

const SORT_LABELS: Record<string, string> = {
    popular: 'POPULAIRE',
    newest: 'NOUVEAUTÉS',
    price_asc: 'PRIX CROISSANT',
    price_desc: 'PRIX DÉCROISSANT',
};

type Props = {
    filters: Filters;
};

function sortQueryParams(filters: Filters, sort: string) {
    return {
        category: filters.category || 'all',
        sort,
        ...(filters.price_filter_active
            ? {
                  min_price: filters.min_price,
                  max_price: filters.max_price,
              }
            : {}),
        ...(filters.q ? { q: filters.q } : {}),
        ...(filters.color ? { color: filters.color } : {}),
    };
}

export function CollectionToolbar({ filters }: Props) {
    const activeSort = filters.sort || 'popular';

    const onSortChange = (sort: string) => {
        if (sort === activeSort) {
            return;
        }

        router.get(route('customer.products.index'), sortQueryParams(filters, sort), {
            preserveState: false,
            preserveScroll: false,
        });
    };

    const breadcrumbItems = [
        { label: 'Accueil', href: route('home') },
        {
            label: filters.q ? `Collection · « ${filters.q} »` : 'Collection',
        },
    ];

    return (
        <div className="flex items-center justify-between gap-3 px-4 py-[15px] sm:px-8 lg:px-12 xl:px-[48px]">
            <StorefrontBreadcrumbs
                className="gap-2.5 text-base font-medium text-[rgba(91,94,100,0.62)] [&_a]:text-[rgba(91,94,100,0.62)] [&_svg]:size-6 [&_span:last-child]:text-black"
                items={breadcrumbItems}
            />

            <Select value={activeSort} onValueChange={onSortChange}>
                <SelectTrigger className="font-poppins h-[33px] w-auto gap-1 rounded-[13px] border border-black px-2.5 text-[8.5px] font-semibold shadow-none sm:h-[50px] sm:min-w-[220px] sm:rounded-[20px] sm:gap-1.5 sm:px-3.5 sm:text-[13px]">
                    <SlidersHorizontal className="size-2.5 shrink-0 sm:size-4" aria-hidden />
                    <span className="whitespace-nowrap">
                        TRIER PAR :{' '}
                        <span className="text-[#999]">
                            {SORT_LABELS[activeSort] ?? 'POPULAIRE'}
                        </span>
                    </span>
                </SelectTrigger>
                <SelectContent className="font-poppins">
                    <SelectItem value="popular">Populaire</SelectItem>
                    <SelectItem value="newest">Nouveautés</SelectItem>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
