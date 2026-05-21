import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FlashToaster } from '@/components/flash-toaster';
import { CartPageLine } from '@/components/storefront/cart/cart-page-line';
import { CartSuggestions } from '@/components/storefront/cart/cart-suggestions';
import { CartSummaryPanel } from '@/components/storefront/cart/cart-summary-panel';
import { HomeCurated } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { StorefrontBreadcrumbs } from '@/components/storefront/storefront-breadcrumbs';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { SF_BTN_PRIMARY, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';
import { destroy as deleteCartItem, update as patchCartItem } from '@/routes/customer/cart/items';

type SuggestedProduct = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    default_variant_id?: number | null;
};

type AuthUser = {
    id: number;
    name?: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    lines: CartLine[];
    subtotal: number;
    shipping: number;
    total: number;
    suggestedProducts: SuggestedProduct[];
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerCart() {
    const { auth, canRegister, lines, subtotal, shipping, total, suggestedProducts } =
        usePage<PageProps>().props;
    const [busyProductId, setBusyProductId] = useState<number | null>(null);

    function mutate(lineKey: number, request: () => void) {
        setBusyProductId(lineKey);
        request();
    }

    function syncCartCount() {
        router.reload({ only: ['lines', 'subtotal', 'total', 'cartCount', 'suggestedProducts'] });
    }

    function setQuantity(line: CartLine, quantity: number) {
        mutate(line.variant_id ?? line.product_id, () => {
            router.patch(
                patchCartItem.url(line.product_id),
                { quantity, variant_id: line.variant_id ?? undefined },
                {
                    preserveScroll: true,
                    onSuccess: syncCartCount,
                    onError: (errors) => {
                        const message =
                            (typeof errors.quantity === 'string' && errors.quantity) ||
                            'Impossible de mettre à jour la quantité.';
                        toast.error(message);
                    },
                    onFinish: () => setBusyProductId(null),
                },
            );
        });
    }

    function removeLine(line: CartLine) {
        mutate(line.variant_id ?? line.product_id, () => {
            router.delete(deleteCartItem.url(line.product_id), {
                data: { variant_id: line.variant_id ?? undefined },
                preserveScroll: true,
                onSuccess: syncCartCount,
                onFinish: () => setBusyProductId(null),
            });
        });
    }

    return (
        <>
            <Head title="Mon panier · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className="pb-16">
                    <div className="mx-auto max-w-[1440px] px-4 pt-9 pb-[60px] sm:px-8 lg:px-[100px]">
                        <h1 className={cn(SF_PAGE_TITLE, 'text-center')}>Mon panier</h1>

                        {lines.length === 0 ? (
                            <div className="py-24 text-center">
                                <p className="font-poppins text-xl font-medium text-[#737373]">
                                    Votre panier est vide.
                                </p>
                                <Button className={cn(SF_BTN_PRIMARY, 'mt-6')} asChild>
                                    <Link href={route('customer.products.index')}>
                                        Parcourir la collection
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-[30px] flex flex-col gap-[30px]">
                                <StorefrontBreadcrumbs
                                    className="font-poppins text-base font-medium text-[rgba(91,94,100,0.62)]"
                                    items={[
                                        { label: 'Accueil', href: route('home') },
                                        { label: 'Panier' },
                                    ]}
                                />

                                <div className="flex flex-col gap-[30px] lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-[769px]">
                                        {lines.map((line) => (
                                            <CartPageLine
                                                key={`${line.product_id}-${line.variant_id ?? 0}`}
                                                line={line}
                                                busy={
                                                    busyProductId ===
                                                    (line.variant_id ?? line.product_id)
                                                }
                                                onQuantityChange={(quantity) =>
                                                    setQuantity(line, quantity)
                                                }
                                                onRemove={() => removeLine(line)}
                                            />
                                        ))}
                                    </div>

                                    <CartSummaryPanel
                                        subtotal={subtotal}
                                        shipping={shipping}
                                        total={total}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {lines.length > 0 ? (
                        <>
                            <CartSuggestions products={suggestedProducts} />
                            <HomeCurated />
                        </>
                    ) : null}
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
