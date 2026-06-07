import { CollectionPriceRange } from '@/components/storefront/collection/collection-price-range';
import { router } from '@inertiajs/react';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type CategoryFilter = {
    name: string;
    count: number;
};

type ColorFilter = {
    name: string;
    hex: string;
    count: number;
};

type Filters = {
    category: string;
    sort: string;
    min_price: number;
    max_price: number;
    price_filter_active?: boolean;
    catalog_min_price?: number;
    catalog_max_price?: number;
    q?: string;
    color?: string;
};

type Props = {
    categories: CategoryFilter[];
    colorOptions: ColorFilter[];
    totalProducts: number;
    filters: Filters;
};

function FiltersPanel({
    categories,
    colorOptions,
    totalProducts,
    filters,
    priceMin,
    priceMax,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    color,
    setColor,
    onApply,
}: {
    categories: CategoryFilter[];
    colorOptions: ColorFilter[];
    totalProducts: number;
    filters: Filters;
    priceMin: number;
    priceMax: number;
    category: string;
    setCategory: (v: string) => void;
    color: string;
    setColor: (v: string) => void;
    minPrice: number;
    setMinPrice: (v: number) => void;
    maxPrice: number;
    setMaxPrice: (v: number) => void;
    onApply: () => void;
}) {
    return (
        <div className="space-y-[37px]">
            <div className="space-y-[15px]">
                <h2 className="font-poppins text-xl font-medium text-black">Catalogue</h2>

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

            {colorOptions.length > 0 ? (
                <div className="space-y-[15px]">
                    <h2 className="font-poppins text-xl font-medium text-black">Couleurs</h2>
                    {colorOptions.map((opt) => (
                        <ColorFilterRow
                            key={opt.name}
                            label={opt.name}
                            hex={opt.hex}
                            count={opt.count}
                            checked={color === opt.name}
                            onCheckedChange={() => setColor(color === opt.name ? '' : opt.name)}
                        />
                    ))}
                    <hr className="border-neutral-200" />
                </div>
            ) : null}

            <div className="space-y-2">
                <h2 className="font-poppins text-xl font-medium text-black">Prix</h2>
                <CollectionPriceRange
                    min={priceMin}
                    max={priceMax}
                    value={[minPrice, maxPrice]}
                    onChange={([nextMin, nextMax]) => {
                        setMinPrice(nextMin);
                        setMaxPrice(nextMax);
                    }}
                />
            </div>

            <Button
                type="button"
                onClick={onApply}
                className="h-[43px] w-full rounded-[32px] bg-black font-poppins text-[13px] font-semibold tracking-wide text-white uppercase hover:bg-neutral-800"
            >
                FILTRE
            </Button>
        </div>
    );
}

export function CollectionFilters({ categories, colorOptions, totalProducts, filters }: Props) {
    const priceMin = filters.catalog_min_price ?? filters.min_price;
    const priceMax = filters.catalog_max_price ?? filters.max_price;
    const [category, setCategory] = useState(filters.category);
    const [color, setColor] = useState(filters.color ?? '');
    const [minPrice, setMinPrice] = useState(filters.min_price);
    const [maxPrice, setMaxPrice] = useState(filters.max_price);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        setCategory(filters.category);
        setColor(filters.color ?? '');
        setMinPrice(filters.min_price);
        setMaxPrice(filters.max_price);
    }, [filters]);

    const applyFilters = () => {
        router.get(
            route('customer.products.index'),
            {
                category,
                sort: filters.sort,
                min_price: minPrice,
                max_price: maxPrice,
                ...(filters.q ? { q: filters.q } : {}),
                ...(color ? { color } : {}),
            },
            {
                preserveState: false,
                preserveScroll: false,
            },
        );
        setMobileOpen(false);
    };

    const panelProps = {
        categories,
        colorOptions,
        totalProducts,
        filters,
        priceMin,
        priceMax,
        category,
        setCategory,
        color,
        setColor,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        onApply: applyFilters,
    };

    return (
        <>
            <Collapsible open={mobileOpen} onOpenChange={setMobileOpen} className="w-full shrink-0 lg:hidden">
                <CollapsibleTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="font-poppins h-12 w-full rounded-[20px] border-black text-sm font-semibold"
                    >
                        <SlidersHorizontal className="mr-2 size-4" />
                        Filtres
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 rounded-[27px] bg-white px-5 py-6">
                    <FiltersPanel {...panelProps} />
                </CollapsibleContent>
            </Collapsible>

            <aside className="hidden w-full max-w-[289px] shrink-0 rounded-[27px] bg-white px-[22px] py-[21px] lg:sticky lg:top-24 lg:block lg:self-start">
                <FiltersPanel {...panelProps} />
            </aside>
        </>
    );
}

function ColorFilterRow({
    label,
    hex,
    count,
    checked,
    onCheckedChange,
}: {
    label: string;
    hex: string;
    count: number;
    checked: boolean;
    onCheckedChange: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onCheckedChange}
            className="flex w-full items-center justify-between gap-2 text-left"
        >
            <div className="flex min-w-0 items-center gap-3">
                <span
                    className={cn(
                        'size-[22px] shrink-0 rounded-full border-2 transition-shadow',
                        hex.toUpperCase() === '#FFFFFF'
                            ? 'border-neutral-300'
                            : 'border-transparent',
                        checked && 'ring-2 ring-black ring-offset-1',
                    )}
                    style={{ backgroundColor: hex }}
                    aria-hidden
                />
                <span className="truncate text-base font-medium text-black">{label}</span>
            </div>
            {count > 0 ? (
                <span className="shrink-0 text-base font-medium text-[rgba(91,94,100,0.62)]">
                    ({count})
                </span>
            ) : null}
        </button>
    );
}

function FilterRow({
    label,
    count,
    checked,
    onCheckedChange,
    leading,
}: {
    label: string;
    count: number;
    checked: boolean;
    onCheckedChange: () => void;
    leading?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
                {leading}
                <Checkbox
                    id={`cat-${label}`}
                    checked={checked}
                    onCheckedChange={(value) => value === true && onCheckedChange()}
                    className="h-[19px] w-5 shrink-0 rounded-[2px] border-[#5B5E64]/60 data-[state=checked]:border-black data-[state=checked]:bg-black"
                />
                <Label
                    htmlFor={`cat-${label}`}
                    className="cursor-pointer truncate text-base font-medium text-black"
                >
                    {label}
                </Label>
            </div>
            {count > 0 ? (
                <span className="shrink-0 text-base font-medium text-[rgba(91,94,100,0.62)]">
                    ({count})
                </span>
            ) : null}
        </div>
    );
}
