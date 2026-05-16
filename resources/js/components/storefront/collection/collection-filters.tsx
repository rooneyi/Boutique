import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type CategoryFilter = {
    name: string;
    count: number;
};

type Filters = {
    category: string;
    sort: string;
    min_price: number;
    max_price: number;
};

type Props = {
    categories: CategoryFilter[];
    totalProducts: number;
    filters: Filters;
};

const COLOR_OPTIONS = [
    { name: 'Noir', color: '#000000' },
    { name: 'Bleu', color: '#0059DD' },
    { name: 'Blanc', color: '#FFFFFF' },
    { name: 'Gris', color: '#BFBFBF' },
] as const;

export function CollectionFilters({ categories, totalProducts, filters }: Props) {
    const [category, setCategory] = useState(filters.category);
    const [minPrice, setMinPrice] = useState(filters.min_price);
    const [maxPrice, setMaxPrice] = useState(filters.max_price);

    const applyFilters = () => {
        router.get(
            route('customer.products.index'),
            {
                category,
                sort: filters.sort,
                min_price: minPrice,
                max_price: maxPrice,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <aside className="w-full max-w-[280px] shrink-0 rounded-[27px] bg-white px-5 py-6 shadow-sm lg:w-[280px]">
            <div className="space-y-9">
                <div className="space-y-4">
                    <h2 className="font-poppins text-xl font-medium text-black">
                        Catalogue
                    </h2>

                    <FilterRow
                        label="Tous"
                        count={totalProducts}
                        checked={category === 'all'}
                        onCheckedChange={() => setCategory('all')}
                    />

                    {categories.map((cat) => (
                        <FilterRow
                            key={cat.name}
                            label={cat.name}
                            count={cat.count}
                            checked={category === cat.name}
                            onCheckedChange={() => setCategory(cat.name)}
                        />
                    ))}

                    <hr className="border-neutral-200" />
                </div>

                <div className="space-y-4">
                    <h2 className="font-poppins text-xl font-medium text-black">
                        Couleurs
                    </h2>
                    {COLOR_OPTIONS.map((opt) => (
                        <div
                            key={opt.name}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className={cn(
                                        'size-5 rounded-full border-2',
                                        opt.color === '#FFFFFF'
                                            ? 'border-neutral-300'
                                            : 'border-transparent',
                                    )}
                                    style={{ backgroundColor: opt.color }}
                                    aria-hidden
                                />
                                <span className="font-poppins text-base font-medium text-black">
                                    {opt.name}
                                </span>
                            </div>
                            <span className="text-base font-medium text-[#5B5E64]/60">
                                (24)
                            </span>
                        </div>
                    ))}
                    <hr className="border-neutral-200" />
                </div>

                <div className="space-y-4">
                    <h2 className="font-poppins text-xl font-medium text-black">Prix</h2>
                    <div className="space-y-3 px-1">
                        <input
                            type="range"
                            min={0}
                            max={200}
                            value={minPrice}
                            onChange={(e) =>
                                setMinPrice(Number(e.target.value))
                            }
                            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-black"
                        />
                        <input
                            type="range"
                            min={0}
                            max={200}
                            value={maxPrice}
                            onChange={(e) =>
                                setMaxPrice(Number(e.target.value))
                            }
                            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-black"
                        />
                        <div className="flex justify-between font-poppins text-base font-medium text-black">
                            <span>{minPrice}</span>
                            <span>{maxPrice}</span>
                        </div>
                    </div>
                </div>

                <Button
                    type="button"
                    onClick={applyFilters}
                    className="h-12 w-full rounded-lg bg-black font-poppins text-sm font-semibold tracking-wide text-white uppercase hover:bg-neutral-800"
                >
                    FILTRE
                </Button>
            </div>
        </aside>
    );
}

function FilterRow({
    label,
    count,
    checked,
    onCheckedChange,
}: {
    label: string;
    count: number;
    checked: boolean;
    onCheckedChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Checkbox
                    id={`cat-${label}`}
                    checked={checked}
                    onCheckedChange={(value) => value === true && onCheckedChange()}
                    className="size-5 rounded-sm border-[#5B5E64]/60 data-[state=checked]:border-black data-[state=checked]:bg-black"
                />
                <Label
                    htmlFor={`cat-${label}`}
                    className="cursor-pointer font-poppins text-base font-medium text-black"
                >
                    {label}
                </Label>
            </div>
            <span className="font-poppins text-base font-medium text-[#5B5E64]/60">
                ({count})
            </span>
        </div>
    );
}
