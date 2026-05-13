import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { destroy as deleteCartItem } from '@/routes/customer/cart/items';
import { route } from '@/lib/route';
import { SF_BTN_PRIMARY, SF_CARD, SF_MUTED, SF_H3, SF_BRAND } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Line = {
    product_id: number;
    quantity: number;
    name: string;
    price: number;
    line_total: number;
    image_path: string | null;
    vendor_shop: string;
    stock: number;
};

type Props = {
    lines: Line[];
    total: number;
};

export default function CustomerCart({ lines, total }: Props) {
    function remove(productId: number) {
        if (confirm('Retirer cet article du panier ?')) {
            router.delete(deleteCartItem.url(productId), { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title="Panier" />

            <div className="space-y-8">
                <div>
                    <h1 className="font-poppins text-3xl font-semibold tracking-tight text-black md:text-4xl">Panier</h1>
                    <p className={cn(SF_MUTED, 'mt-2')}>Articles prêts à être commandés sur {SF_BRAND}.</p>
                </div>

                {lines.length === 0 ? (
                    <Card className={cn(SF_CARD, 'p-8 text-center')}>
                        <p className="text-[#747474]">Votre panier est vide.</p>
                        <Button className={cn(SF_BTN_PRIMARY, 'mt-6')} asChild>
                            <Link href={route('customer.products.index')}>Parcourir le catalogue</Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-4 lg:col-span-2">
                            {lines.map((line) => (
                                <Card key={line.product_id} className={SF_CARD}>
                                    <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
                                            {line.image_path ? (
                                                <img src={line.image_path} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-[#747474]">—</div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-[#747474]">{line.vendor_shop}</p>
                                            <Link
                                                href={route('customer.products.show', line.product_id)}
                                                className="font-poppins font-semibold text-black hover:text-[#0059DD]"
                                            >
                                                {line.name}
                                            </Link>
                                            <p className="mt-1 text-sm text-[#747474]">
                                                Qté {line.quantity} · €{line.price.toFixed(2)} l’unité
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                            <p className="font-poppins text-lg font-semibold">€{line.line_total.toFixed(2)}</p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="shrink-0 rounded-sm"
                                                onClick={() => remove(line.product_id)}
                                                aria-label="Retirer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card className={cn(SF_CARD, 'h-fit lg:sticky lg:top-24')}>
                            <CardHeader>
                                <h2 className={SF_H3}>Récapitulatif</h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="font-poppins text-2xl font-semibold text-black">€{total.toFixed(2)}</p>
                                <p className="text-sm text-[#747474]">
                                    Le paiement sécurisé et la validation de commande arrivent dans une prochaine étape.
                                </p>
                                <Button className={cn(SF_BTN_PRIMARY, 'w-full')} disabled>
                                    Commander
                                </Button>
                                <Link
                                    href={route('customer.products.index')}
                                    className="block text-center text-sm font-semibold text-[#0059DD] hover:underline"
                                >
                                    Continuer les achats
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}
