import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { CollectionFilters } from '@/components/storefront/collection/collection-filters';
import { CollectionHero } from '@/components/storefront/collection/collection-hero';
import { CollectionPagination } from '@/components/storefront/collection/collection-pagination';
import { CollectionToolbar } from '@/components/storefront/collection/collection-toolbar';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { HomeCurated, type CuratedProduct } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';

type Product = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

type PaginatedProducts = {
    data: Product[];
    links?: { url: string | null; label: string; active: boolean }[];
    meta?: { current_page: number; last_page: number; total: number };
};

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
    q?: string;
    color?: string;
};

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    products: PaginatedProducts;
    categories: CategoryFilter[];
    colorOptions: ColorFilter[];
    totalProducts: number;
    filters: Filters;
    canRegister: boolean;
    curatedProducts: CuratedProduct[];
    auth?: { user?: AuthUser | null };
};

export default function BrowseProducts() {
    const { auth, canRegister, products, categories, colorOptions, totalProducts, filters, curatedProducts } =
        usePage<PageProps>().props;
    const items = products.data ?? [];

    return (
        <>
            <Head title="Collection · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader
                    user={auth?.user}
                    canRegister={canRegister}
                    activeNav="collection"
                />

                <main>
                    <CollectionHero />

                    {/* Figma 126:3227 — py 40, gap 25 */}
                    <section className="flex flex-col gap-[25px] py-10">
                        <div className="mx-auto w-full max-w-[1440px]">
                            <CollectionToolbar filters={filters} />

                            <div className="mt-0 flex flex-col gap-6 px-4 sm:px-8 lg:flex-row lg:items-start lg:gap-2.5 lg:px-7">
                                <CollectionFilters
                                    categories={categories}
                                    colorOptions={colorOptions ?? []}
                                    totalProducts={totalProducts}
                                    filters={filters}
                                />

                                <div className="flex min-w-0 flex-1 flex-col gap-8 lg:max-w-[1085px]">
                                    {items.length > 0 ? (
                                        <>
                                            <div
                                                key={`${filters.sort}-${filters.category}-${filters.color ?? ''}-${filters.price_filter_active ? `${filters.min_price}-${filters.max_price}` : ''}`}
                                                className="collection-product-grid grid grid-cols-2 justify-items-center gap-2.5 px-2.5 lg:grid-cols-3 lg:justify-items-start lg:px-[18px]"
                                            >
                                                {items.map((product) => (
                                                    <HomeProductShowcaseCard
                                                        key={product.id}
                                                        product={product}
                                                        size="collection"
                                                    />
                                                ))}
                                            </div>
                                            <CollectionPagination
                                                links={products.links}
                                                meta={products.meta}
                                            />
                                        </>
                                    ) : (
                                        <p className="py-16 text-center font-poppins text-lg text-[#747474]">
                                            Aucun produit ne correspond à vos filtres.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <HomeCurated variant="collection" products={curatedProducts} />
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
