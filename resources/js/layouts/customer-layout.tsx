import { FlashToaster } from '@/components/flash-toaster';
import { InertiaPropsSync } from '@/components/storefront/inertia-props-sync';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { useOptionalCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { ReactNode, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, Store, ShoppingBag, ChevronDown, ShoppingCart, Heart } from 'lucide-react';
import { route } from '@/lib/route';
import { StorefrontLogo } from '@/components/storefront/storefront-logo';
import { SF_NAV_LINK } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

export default function CustomerLayout({ children }: { children: ReactNode }) {
    const page = usePage<{
        auth: { user?: AuthUser | null };
        cartCount?: number;
        favoritesCount?: number;
    }>();
    const { auth, cartCount = 0, favoritesCount = 0 } = page.props;
    const user = auth?.user;
    const isCustomer = user?.role === 'CUSTOMER';
    const cartDrawer = useOptionalCartDrawer();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const accountDrawer = useOptionalAccountDrawer();

    const headerBrand = useMemo(() => <StorefrontLogo variant="on-light" />, []);

    return (
        <div className="flex min-h-screen flex-col bg-white font-poppins text-black antialiased">
            <InertiaPropsSync />
            <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                    {headerBrand}

                    <nav className="order-3 flex w-full basis-full flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm sm:order-none sm:w-auto sm:flex-1 sm:basis-auto md:gap-6 md:text-base">
                        <Link href={route('customer.products.index')} className={cn(SF_NAV_LINK, 'inline-flex items-center gap-2')}>
                            <Store className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                            Collection
                        </Link>
                        {isCustomer && (
                            <>
                                <button
                                    type="button"
                                    className={cn(SF_NAV_LINK, 'inline-flex items-center gap-2')}
                                    onClick={() => favoritesDrawer?.openFavorites()}
                                >
                                    <Heart className="h-4 w-4 shrink-0 text-[#dc0000]" aria-hidden />
                                    Favoris
                                    {favoritesCount > 0 && (
                                        <Badge className="rounded-sm border-0 bg-[#0059DD] px-2 py-0 text-xs font-semibold text-white">
                                            {favoritesCount}
                                        </Badge>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className={cn(SF_NAV_LINK, 'inline-flex items-center gap-2')}
                                    onClick={() => cartDrawer?.openCart()}
                                >
                                    <ShoppingCart className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                    Panier
                                    {cartCount > 0 && (
                                        <Badge className="rounded-sm border-0 bg-[#0059DD] px-2 py-0 text-xs font-semibold text-white">
                                            {cartCount}
                                        </Badge>
                                    )}
                                </button>
                                <Link href={route('customer.orders.index')} className={cn(SF_NAV_LINK, 'inline-flex items-center gap-2')}>
                                    <ShoppingBag className="h-4 w-4 shrink-0 text-[#747474]" aria-hidden />
                                    Commandes
                                </Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-2">
                        {!user && (
                            <Button
                                size="sm"
                                className="rounded-sm bg-[#0059DD] font-poppins hover:bg-[#0047b0]"
                                onClick={() => accountDrawer?.openAccount()}
                            >
                                Se connecter
                            </Button>
                        )}

                        {user && isCustomer && (
                            <button
                                type="button"
                                className="relative inline-flex md:hidden"
                                onClick={() => cartDrawer?.openCart()}
                                aria-label="Panier"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-[#0059DD] px-1 text-[10px] font-bold text-white">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </button>
                        )}

                        {user && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="font-poppins">
                                        <span className="hidden max-w-[140px] truncate sm:inline">{user.name}</span>
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="font-poppins">
                                    <DropdownMenuItem disabled className="flex flex-col items-start gap-0.5">
                                        <span className="font-medium">{user.name}</span>
                                        <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => accountDrawer?.openAccount()}>
                                        Mon compte
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={route('logout')} method="post">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Déconnexion
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

            <footer className="mt-auto border-t border-neutral-100 bg-neutral-50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                    <div className="grid gap-4 text-center text-sm text-[#747474] md:grid-cols-3 md:text-left">
                        <div>
                            <p className="mb-1 font-medium text-black">PCJ</p>
                            <p>Mode en ligne</p>
                        </div>
                        <div>
                            <p className="mb-1 font-medium text-black">Contact</p>
                            <p>support@posercommejamais.com</p>
                        </div>
                        <div>
                            <p className="mb-1 font-medium text-black">Légal</p>
                            <p>© {new Date().getFullYear()} Posé comme jamais</p>
                        </div>
                    </div>
                </div>
            </footer>
            <FlashToaster />
        </div>
    );
}
