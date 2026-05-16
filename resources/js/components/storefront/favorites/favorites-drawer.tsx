import { Link } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { HomeProductShowcaseCard } from '@/components/storefront/home/home-product-showcase-card';
import { useFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { route } from '@/lib/route';

export function FavoritesDrawer() {
    const { open, closeFavorites, products, loading } = useFavoritesDrawer();

    const isEmpty = !loading && products.length === 0;

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeFavorites()}>
            <SheetContent
                side="right"
                size="wide"
                showCloseButton={false}
                className="flex flex-col overflow-hidden border-0 bg-white p-0"
                overlayClassName="bg-black/60 backdrop-blur-[2px]"
            >
                <div className="relative shrink-0 px-5 pt-10">
                    <SheetTitle className="font-poppins text-[36px] font-semibold leading-normal text-black">
                        Mes favoris
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-[52px] right-[30px] size-10 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeFavorites}
                        aria-label="Fermer les favoris"
                    >
                        <X className="size-10" strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Produits enregistrés dans vos favoris
                </SheetDescription>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10">
                    <div className="max-w-[751px] p-2.5">
                        {loading && products.length === 0 ? (
                            <div className="flex items-center justify-center py-24 text-[#737373]">
                                <Loader2 className="size-8 animate-spin" aria-hidden />
                                <span className="sr-only">Chargement des favoris</span>
                            </div>
                        ) : isEmpty ? (
                            <div className="py-24 text-center">
                                <p className="font-poppins text-xl font-medium text-[#737373]">
                                    Vous n&apos;avez pas encore de favoris.
                                </p>
                                <Link
                                    href={route('customer.products.index')}
                                    className="font-poppins mt-4 inline-block text-lg font-semibold text-[#0059DD] hover:underline"
                                    onClick={closeFavorites}
                                >
                                    Parcourir la collection
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2">
                                {products.map((product) => (
                                    <HomeProductShowcaseCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
