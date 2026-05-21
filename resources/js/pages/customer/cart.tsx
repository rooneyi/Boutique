import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { FlashToaster } from '@/components/flash-toaster';
import { CartPageLine } from '@/components/storefront/cart/cart-page-line';
import { CartSummaryPanel } from '@/components/storefront/cart/cart-summary-panel';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import { SF_BTN_PRIMARY, SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';
import { destroy as deleteCartItem, update as patchCartItem } from '@/routes/customer/cart/items';

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
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerCart() {
    const { auth, canRegister, lines, subtotal, shipping, total } = usePage<PageProps>().props;
    const [busyProductId, setBusyProductId] = useState<number | null>(null);

    function mutate(lineKey: number, request: () => void) {
        setBusyProductId(lineKey);
        request();
    }

    function syncCartCount() {
        router.reload({ only: ['lines', 'subtotal', 'total', 'cartCount'] });
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

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <h1 className={cn(SF_PAGE_TITLE, 'pt-6 pb-8 sm:pt-8 sm:pb-10')}>
                            Mon panier
                        </h1>

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
                            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
                                <div className="min-w-0 flex-1">
                                    {lines.map((line) => (
                                        <CartPageLine
                                            key={`${line.product_id}-${line.variant_id ?? 0}`}
                                            line={line}
                                            busy={busyProductId === (line.variant_id ?? line.product_id)}
                                            onQuantityChange={(quantity) => setQuantity(line, quantity)}
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
                        )}
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
