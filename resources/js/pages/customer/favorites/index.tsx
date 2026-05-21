import { Head, Link, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { FavoritesSuggestedCarousel } from '@/components/storefront/favorites/favorites-suggested-carousel';
import { HomeCurated } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { SF_BTN_PRIMARY, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

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

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    products: PaginatedProducts;
    suggestedProducts: Product[];
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerFavorites() {
    const { auth, canRegister, products, suggestedProducts } = usePage<PageProps>().props;
    const items = products.data ?? [];

    return (
        <>
            <Head title="Mes favoris · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main>
                    <section className="px-4 py-9 sm:px-8 lg:px-[100px]">
                        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8">
                            <h1 className={cn(SF_PAGE_TITLE, 'text-center')}>Mes favoris</h1>

                            {items.length === 0 ? (
                                <div className="py-16 text-center">
                                    <p className="font-poppins text-xl font-medium text-[#737373]">
                                        Vous n&apos;avez pas encore de favoris.
                                    </p>
                                    <Button className={cn(SF_BTN_PRIMARY, 'mt-6')} asChild>
                                        <Link href={route('customer.products.index')}>
                                            Parcourir la collection
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid w-full grid-cols-2 justify-items-center gap-4 sm:gap-8 xl:grid-cols-3">
                                        {items.map((product) => (
                                            <HomeProductShowcaseCard
                                                key={product.id}
                                                product={product}
                                                size="compact"
                                            />
                                        ))}
                                    </div>

                                    {products.meta && products.meta.last_page > 1 && (
                                        <nav className="flex flex-wrap items-center justify-center gap-2 pt-4">
                                            {products.links?.map((link, i) => {
                                                if (link.label.includes('...')) {
                                                    return (
                                                        <span key={i} className="px-2 text-[#737373]">
                                                            …
                                                        </span>
                                                    );
                                                }
                                                const label = link.label.replace(/<[^>]+>/g, '').trim();
                                                if (!link.url) {
                                                    return (
                                                        <Button
                                                            key={i}
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-full"
                                                            disabled
                                                        >
                                                            {label}
                                                        </Button>
                                                    );
                                                }
                                                return (
                                                    <Button
                                                        key={i}
                                                        variant={link.active ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="rounded-full"
                                                        asChild
                                                    >
                                                        <Link href={link.url} preserveScroll>
                                                            {label}
                                                        </Link>
                                                    </Button>
                                                );
                                            })}
                                        </nav>
                                    )}
                                </>
                            )}
                        </div>
                    </section>

                    <FavoritesSuggestedCarousel products={suggestedProducts} />
                    <HomeCurated />
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
