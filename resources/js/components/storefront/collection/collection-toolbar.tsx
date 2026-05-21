import { Link, router } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

    return (
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:px-8 lg:px-12">
            <nav
                className="flex min-w-0 flex-wrap items-center gap-2 font-poppins text-sm font-medium sm:gap-2.5 sm:text-base"
                aria-label="Fil d'Ariane"
            >
                <Link
                    href={route('home')}
                    className="text-[#5B5E64]/60 transition-colors hover:text-black"
                >
                    Accueil
                </Link>
                <ArrowRight className="size-5 text-[#5B5E64]/60" aria-hidden />
                <span className="text-black">
                    Collection
                    {filters.q ? (
                        <span className="ml-1 text-sm font-normal text-[#747474]">
                            · « {filters.q} »
                        </span>
                    ) : null}
                </span>
            </nav>

            <Select value={filters.sort} onValueChange={onSortChange}>
                <SelectTrigger className="font-poppins h-12 w-full rounded-[20px] border-black text-xs font-semibold sm:min-w-[220px] sm:w-auto sm:text-[13px]">
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
