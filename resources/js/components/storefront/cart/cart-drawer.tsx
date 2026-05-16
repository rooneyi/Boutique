import { Link, router } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CartDrawerLine } from '@/components/storefront/cart/cart-drawer-line';
import { useCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { route } from '@/lib/route';
import { SF_PILL_BTN_DARK } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';
import { destroy as deleteCartItem, update as patchCartItem } from '@/routes/customer/cart/items';

export function CartDrawer() {
    const { open, closeCart, lines, total, loading, refresh } = useCartDrawer();
    const [busyProductId, setBusyProductId] = useState<number | null>(null);

    function mutate(
        productId: number,
        request: () => void,
    ) {
        setBusyProductId(productId);
        request();
    }

    function setQuantity(productId: number, quantity: number) {
        mutate(productId, () => {
            router.patch(
                patchCartItem.url(productId),
                { quantity },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        void refresh();
                        syncCartCount();
                    },
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

    function removeLine(productId: number) {
        mutate(productId, () => {
            router.delete(deleteCartItem.url(productId), {
                preserveScroll: true,
                onSuccess: () => {
                    void refresh();
                    syncCartCount();
                },
                onFinish: () => setBusyProductId(null),
            });
        });
    }

    const isEmpty = !loading && lines.length === 0;

    function syncCartCount() {
        router.reload({ only: ['cartCount'] });
    }

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeCart()}>
            <SheetContent
                side="right"
                showCloseButton={false}
                className="flex w-full max-w-[min(791px,100vw)] flex-col gap-0 border-0 bg-white p-0 sm:max-w-[min(791px,100vw)]"
                overlayClassName="bg-black/60 backdrop-blur-sm"
            >
                <div className="flex items-start justify-between border-b border-[#e8e8e8] px-8 py-8 sm:px-12">
                    <SheetTitle className="font-poppins text-[40px] font-bold leading-none text-black">
                        Mon panier
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-10 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeCart}
                        aria-label="Fermer le panier"
                    >
                        <X className="size-8" strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Articles ajoutés à votre panier
                </SheetDescription>

                <div className="flex-1 overflow-y-auto px-8 sm:px-12">
                    {loading && lines.length === 0 ? (
                        <div className="flex items-center justify-center py-24 text-[#737373]">
                            <Loader2 className="size-8 animate-spin" aria-hidden />
                            <span className="sr-only">Chargement du panier</span>
                        </div>
                    ) : isEmpty ? (
                        <div className="py-24 text-center">
                            <p className="font-poppins text-xl text-[#737373]">
                                Votre panier est vide.
                            </p>
                            <Link
                                href={route('customer.products.index')}
                                className="font-poppins mt-4 inline-block text-lg font-semibold text-[#0059DD] hover:underline"
                                onClick={closeCart}
                            >
                                Parcourir la collection
                            </Link>
                        </div>
                    ) : (
                        <div className="pb-4">
                            {lines.map((line) => (
                                <CartDrawerLine
                                    key={line.product_id}
                                    line={line}
                                    busy={busyProductId === line.product_id}
                                    onQuantityChange={(quantity) =>
                                        setQuantity(line.product_id, quantity)
                                    }
                                    onRemove={() => removeLine(line.product_id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {!isEmpty && lines.length > 0 && (
                    <footer className="border-t border-[#e8e8e8] px-8 py-8 sm:px-12">
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <p className="font-poppins text-[32px] font-semibold text-black">
                                Total :
                            </p>
                            <p className="font-poppins text-[40px] font-bold text-[#0059DD]">
                                {total.toFixed(2)} $
                            </p>
                        </div>
                        <Button
                            type="button"
                            className={cn(SF_PILL_BTN_DARK, 'mt-8 h-14 w-full text-base uppercase tracking-wide')}
                            onClick={closeCart}
                            asChild
                        >
                            <Link href={route('customer.cart')}>Passer commande</Link>
                        </Button>
                    </footer>
                )}
            </SheetContent>
        </Sheet>
    );
}
