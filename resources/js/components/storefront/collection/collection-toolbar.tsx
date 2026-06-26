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

function collectionBreadcrumbItems(filters: Filters) {
    const hasActiveFilter =
        (filters.category && filters.category !== 'all') ||
        Boolean(filters.q) ||
        Boolean(filters.color) ||
        Boolean(filters.price_filter_active);

    const items = [
        { label: 'Accueil', href: route('home') },
        {
            label: 'Collection',
            href: hasActiveFilter ? route('customer.products.index') : undefined,
        },
    ];

    if (filters.q) {
        items.push({ label: `« ${filters.q} »` });
    } else if (filters.category && filters.category !== 'all') {
        items.push({ label: filters.category });
    } else if (filters.color) {
        items.push({ label: filters.color });
    }

    return items;
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

    const breadcrumbItems = collectionBreadcrumbItems(filters);

    return (
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-[15px]">
            <StorefrontBreadcrumbs className="min-w-0 flex-1" items={breadcrumbItems} />

            <Select value={activeSort} onValueChange={onSortChange}>
                <SelectTrigger className="font-poppins h-[33px] w-full shrink-0 gap-1 rounded-[13px] border border-black px-2.5 text-[8.5px] font-semibold shadow-none sm:h-[50px] sm:w-auto sm:min-w-[220px] sm:rounded-[20px] sm:gap-1.5 sm:px-3.5 sm:text-[13px] lg:max-w-[280px]">
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
