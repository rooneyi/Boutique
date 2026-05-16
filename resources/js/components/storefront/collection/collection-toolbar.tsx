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
            { ...filters, sort },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-12">
            <nav
                className="flex items-center gap-2.5 font-poppins text-base font-medium"
                aria-label="Fil d'Ariane"
            >
                <Link
                    href={route('home')}
                    className="text-[#5B5E64]/60 transition-colors hover:text-black"
                >
                    Accueil
                </Link>
                <ArrowRight className="size-5 text-[#5B5E64]/60" aria-hidden />
                <span className="text-black">Collection</span>
            </nav>

            <Select value={filters.sort} onValueChange={onSortChange}>
                <SelectTrigger className="h-12 min-w-[220px] rounded-[20px] border-black font-poppins text-[13px] font-semibold">
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
