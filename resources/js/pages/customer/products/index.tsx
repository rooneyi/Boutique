import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { CollectionFilters } from '@/components/storefront/collection/collection-filters';
import { CollectionHero } from '@/components/storefront/collection/collection-hero';
import { CollectionPagination } from '@/components/storefront/collection/collection-pagination';
import { CollectionToolbar } from '@/components/storefront/collection/collection-toolbar';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { HomeCurated } from '@/components/storefront/home/home-curated';
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

type Filters = {
    category: string;
    sort: string;
    min_price: number;
    max_price: number;
    q?: string;
};

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    products: PaginatedProducts;
    categories: CategoryFilter[];
    totalProducts: number;
    filters: Filters;
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function BrowseProducts() {
    const { auth, canRegister, products, categories, totalProducts, filters } =
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
                    <CollectionToolbar filters={filters} />

                    <section className="px-4 pb-12 sm:px-8 sm:pb-16 lg:px-7">
                        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 lg:flex-row lg:gap-3">
                            <CollectionFilters
                                categories={categories}
                                totalProducts={totalProducts}
                                filters={filters}
                            />

                            <div className="min-w-0 flex-1">
                                {items.length > 0 ? (
                                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                                        {items.map((product) => (
                                            <HomeProductShowcaseCard
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-16 text-center font-poppins text-lg text-[#747474]">
                                        Aucun produit ne correspond à vos filtres.
                                    </p>
                                )}

                                <CollectionPagination
                                    links={products.links}
                                    meta={products.meta}
                                />
                            </div>
                        </div>
                    </section>

                    <HomeCurated />
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
