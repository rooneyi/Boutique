import { Link, router } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CartDrawerLine } from '@/components/storefront/cart/cart-drawer-line';
import { useCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import type { CartLine } from '@/components/storefront/cart/cart-types';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';
import { destroy as deleteCartItem, update as patchCartItem } from '@/routes/customer/cart/items';

export function CartDrawer() {
    const { open, closeCart, lines, total, loading, refresh } = useCartDrawer();
    const [busyProductId, setBusyProductId] = useState<number | null>(null);

    function mutate(lineKey: number, request: () => void) {
        setBusyProductId(lineKey);
        request();
    }

    function syncCartCount() {
        router.reload({ only: ['cartCount'] });
    }

    function setQuantity(line: CartLine, quantity: number) {
        mutate(line.variant_id ?? line.product_id, () => {
            router.patch(
                patchCartItem.url(line.product_id),
                { quantity, variant_id: line.variant_id ?? undefined },
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

    function removeLine(line: CartLine) {
        mutate(line.variant_id ?? line.product_id, () => {
            router.delete(deleteCartItem.url(line.product_id), {
                data: { variant_id: line.variant_id ?? undefined },
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

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeCart()}>
            <SheetContent
                side="right"
                size="wide"
                showCloseButton={false}
                className="flex flex-col overflow-hidden border-0 bg-white p-0"
                overlayClassName="bg-black/60 backdrop-blur-[2px]"
            >
                <div className="relative shrink-0 px-5 pt-10">
                    <SheetTitle className="font-poppins text-[36px] font-semibold leading-normal text-black">
                        Mon panier
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-[52px] right-[30px] size-10 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeCart}
                        aria-label="Fermer le panier"
                    >
                        <X className="size-10" strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Articles ajoutés à votre panier
                </SheetDescription>

                <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-5 pb-6">
                    <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
                        {loading && lines.length === 0 ? (
                            <div className="flex items-center justify-center py-24 text-[#737373]">
                                <Loader2 className="size-8 animate-spin" aria-hidden />
                                <span className="sr-only">Chargement du panier</span>
                            </div>
                        ) : isEmpty ? (
                            <div className="py-24 text-center">
                                <p className="font-poppins text-xl font-medium text-[#737373]">
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
                            <div className="flex flex-col gap-5">
                                {lines.map((line, index) => (
                                    <CartDrawerLine
                                        key={`${line.product_id}-${line.variant_id ?? 0}`}
                                        line={line}
                                        busy={busyProductId === (line.variant_id ?? line.product_id)}
                                        showRemove={lines.length === 1 || index > 0}
                                        onQuantityChange={(quantity) => setQuantity(line, quantity)}
                                        onRemove={() => removeLine(line)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {!isEmpty && lines.length > 0 && (
                        <footer className="shrink-0 bg-white px-[15px] pt-2.5 pb-6 shadow-[0_-0.1px_2px_rgba(0,0,0,0.2)]">
                            <div className="font-poppins flex items-center justify-between text-[28px] font-semibold leading-normal">
                                <span className="text-black">Total :</span>
                                <span className="text-[#0059DD]">{total.toFixed(2)}$</span>
                            </div>
                            <Button
                                type="button"
                                className={cn(
                                    'font-poppins mt-2.5 h-auto w-full rounded-[27px] border border-black bg-black py-[18px] text-base font-semibold uppercase text-white hover:bg-neutral-800',
                                )}
                                onClick={closeCart}
                                asChild
                            >
                                <Link href={route('customer.checkout')}>PASSER LA COMMANDE</Link>
                            </Button>
                        </footer>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
