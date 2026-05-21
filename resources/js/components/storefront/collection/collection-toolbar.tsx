import { router } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import { route } from '@/lib/route';

type Filters = {
    category: string;
    sort: string;
    min_price: number;
    max_price: number;
    q?: string;
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

export function CollectionToolbar({ filters }: Props) {
    const onSortChange = (sort: string) => {
        router.get(
            route('customer.products.index'),
            {
                category: filters.category,
                sort,
                min_price: filters.min_price,
                max_price: filters.max_price,
                ...(filters.q ? { q: filters.q } : {}),
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const breadcrumbItems = [
        { label: 'Accueil', href: route('home') },
        {
            label: filters.q ? `Collection · « ${filters.q} »` : 'Collection',
        },
    ];

    return (
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-8 lg:px-12">
            <StorefrontBreadcrumbs
                className="font-poppins text-[11px] font-medium text-[rgba(91,94,100,0.62)] sm:text-base"
                items={breadcrumbItems}
            />

            <Select value={filters.sort} onValueChange={onSortChange}>
                <SelectTrigger className="font-poppins h-[34px] w-auto gap-1 rounded-[13px] border border-black px-2.5 text-[9px] font-semibold shadow-none sm:h-12 sm:min-w-[200px] sm:rounded-[20px] sm:px-4 sm:text-[13px]">
                    <SlidersHorizontal className="size-3 shrink-0 sm:size-4" aria-hidden />
                    <span>
                        TRIER PAR :{' '}
                        <span className="text-[#999]">
                            {SORT_LABELS[filters.sort] ?? 'POPULAIRE'}
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
