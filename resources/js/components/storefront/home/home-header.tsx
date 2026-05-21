import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    Globe,
    Heart,
    Instagram,
    Menu,
    Search,
    ShoppingCart,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { InertiaPropsSync } from '@/components/storefront/inertia-props-sync';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { useOptionalCartDrawer } from '@/components/storefront/cart/cart-drawer-context';
import { useOptionalFavoritesDrawer } from '@/components/storefront/favorites/favorites-drawer-context';
import { HOME_ASSETS } from '@/lib/home-assets';
import { ADMIN_MAIN_NAV, ADMIN_STOCK_NAV } from '@/lib/admin-nav';
import { route } from '@/lib/route';
import { SF_NAV_ITEM, SF_NAV_ITEM_ACTIVE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type ActiveNav = 'home' | 'collection' | 'contact';

type Props = {
    user?: AuthUser | null;
    canRegister?: boolean;
    activeNav?: ActiveNav;
    /** Vitrine par défaut ; admin réutilise le même chrome PCJ */
    chrome?: 'storefront' | 'admin';
    adminPath?: string;
};

function parseSearchFromUrl(url: string): string {
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1) {
        return '';
    }
    return new URLSearchParams(url.slice(queryIndex + 1)).get('q') ?? '';
}

const NAV_ITEMS = [
    { key: 'home' as const, label: 'Accueil', href: route('home') },
    {
        key: 'collection' as const,
        label: 'Collection',
        href: route('customer.products.index'),
    },
    { key: 'about' as const, label: 'A Propos', href: `${route('home')}#pourquoi-nous` },
    { key: 'contact' as const, label: 'Contact', href: route('contact') },
];

export function HomeHeader({
    user,
    canRegister = false,
    activeNav = 'home',
    chrome = 'storefront',
    adminPath = '',
}: Props) {
    const isAdmin = chrome === 'admin';
    const path = adminPath;
    const page = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const cartDrawer = useOptionalCartDrawer();
    const favoritesDrawer = useOptionalFavoritesDrawer();
    const accountDrawer = useOptionalAccountDrawer();

    function openAccount() {
        if (user?.role === 'CUSTOMER') {
            accountDrawer?.openAccount();
        } else {
            router.visit(route('login'));
        }
    }

    const accountHref =
        user?.role === 'ADMIN'
            ? '/admin/dashboard'
            : user?.role === 'VENDOR'
              ? '/vendor/dashboard'
              : user?.role === 'CUSTOMER'
                ? route('customer.products.index')
                : route('login');

    useEffect(() => {
        if (!isAdmin) {
            setSearchQuery(parseSearchFromUrl(page.url));
        }
    }, [page.url, isAdmin]);

    useEffect(() => {
        if (!mobileOpen) {
            return;
        }
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileOpen]);

    function closeMobileMenu() {
        setMobileOpen(false);
    }

    function submitSearch(event?: FormEvent) {
        event?.preventDefault();
        if (isAdmin) {
            return;
        }
        const q = searchQuery.trim();
        router.get(
            route('customer.products.index'),
            q ? { q, category: 'all', sort: 'popular' } : { category: 'all', sort: 'popular' },
        );
        closeMobileMenu();
    }

    const searchField = (
        <>
            <Search className="size-5 shrink-0 text-[#999]" aria-hidden />
            <input
                type="search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que recherchez-vous ?"
                className="font-poppins w-full min-w-0 border-0 bg-transparent text-base text-black placeholder:text-[#999] focus:outline-none"
                aria-label="Rechercher un produit"
            />
        </>
    );

    return (
        <>
            <InertiaPropsSync />
            <header className="sticky top-0 z-50">
            <div className="bg-black text-white">
                <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8 lg:px-[102px]">
                    <div className="flex items-center gap-3">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white/90 transition-colors hover:text-white"
                            aria-label="Instagram"
                        >
                            <Instagram className="size-7" strokeWidth={1.5} />
                        </a>
                        {isAdmin ? (
                            <span className="hidden font-poppins text-sm font-medium text-white/90 sm:inline">
                                Administration PCJ
                            </span>
                        ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                        {isAdmin ? (
                            <Link
                                href={route('home')}
                                className="font-poppins font-normal text-white/90 transition-opacity hover:text-white"
                            >
                                Voir la boutique
                            </Link>
                        ) : null}
                        {!isAdmin && canRegister && !user ? (
                            <Link
                                href={route('auth.customer.register')}
                                className="flex items-center gap-2 transition-opacity hover:opacity-80"
                            >
                                <User className="size-5" strokeWidth={1.5} />
                                <span className="font-poppins font-normal">
                                    Rejoignez-nous
                                </span>
                            </Link>
                        ) : null}
                        <div
                            className={cn(
                                'flex items-center gap-2 text-white/90',
                                isAdmin && 'hidden sm:flex',
                            )}
                        >
                            <Globe className="size-5" strokeWidth={1.5} />
                            <span className="font-poppins font-normal">
                                Lubumbashi
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:py-4 sm:px-8 lg:px-[100px]">
                    <Link
                        href={isAdmin ? route('admin.dashboard') : route('home')}
                        className="shrink-0"
                    >
                        <img
                            src={HOME_ASSETS.logo}
                            alt="PCJ"
                            className="h-12 w-12 object-contain"
                        />
                    </Link>

                    <nav
                        className={cn(
                            'hidden items-center gap-1 lg:flex',
                            isAdmin &&
                                'min-w-0 flex-1 justify-center gap-0.5 overflow-x-auto xl:gap-1 [scrollbar-width:thin]',
                        )}
                    >
                        {isAdmin
                            ? ADMIN_MAIN_NAV.map((item) => {
                                  const isActive = item.match(path);
                                  return (
                                      <Link
                                          key={item.label}
                                          href={item.href}
                                          className={cn(
                                              isActive ? SF_NAV_ITEM_ACTIVE : SF_NAV_ITEM,
                                              'flex shrink-0 flex-col items-center px-2 text-sm xl:px-4 xl:text-base',
                                          )}
                                      >
                                          <span className="xl:hidden">{item.shortLabel ?? item.label}</span>
                                          <span className="hidden xl:inline">{item.label}</span>
                                          {isActive ? (
                                              <span className="mt-0.5 size-1.5 rounded-full bg-[#0059DD]" />
                                          ) : null}
                                      </Link>
                                  );
                              })
                            : NAV_ITEMS.map((item) => {
                                  const isActive = item.key === activeNav;
                                  const isContactActive =
                                      isActive && item.key === 'contact';
                                  return (
                                      <Link
                                          key={item.label}
                                          href={item.href}
                                          className={
                                              isContactActive
                                                  ? 'font-poppins border-b-2 border-[#0059DD] px-2.5 py-2.5 text-base font-medium text-black'
                                                  : isActive
                                                    ? SF_NAV_ITEM_ACTIVE
                                                    : SF_NAV_ITEM
                                          }
                                      >
                                          {item.label}
                                          {isActive && !isContactActive ? (
                                              <span className="mt-0.5 size-1.5 rounded-full bg-[#0059DD]" />
                                          ) : null}
                                      </Link>
                                  );
                              })}
                    </nav>

                    <div className="flex items-center gap-3 sm:gap-4">
                        {!isAdmin && (
                            <form
                                onSubmit={submitSearch}
                                className="hidden min-w-[200px] items-center gap-3 border-b border-[#bfbfbf] pb-2 md:flex lg:min-w-[280px]"
                                role="search"
                            >
                                {searchField}
                            </form>
                        )}
                        {user?.role === 'CUSTOMER' ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hidden rounded-full text-black lg:inline-flex"
                                onClick={openAccount}
                                aria-label="Mon compte"
                            >
                                <User className="size-6" strokeWidth={1.25} />
                            </Button>
                        ) : !isAdmin ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hidden rounded-full text-black lg:inline-flex"
                                asChild
                            >
                                <Link href={accountHref} aria-label="Notifications">
                                    <Bell className="size-6" strokeWidth={1.25} />
                                </Link>
                            </Button>
                        ) : null}
                        {!isAdmin && (
                            <>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full text-black"
                                    onClick={() => {
                                        if (user?.role === 'CUSTOMER') {
                                            favoritesDrawer?.openFavorites();
                                        } else {
                                            router.visit(route('login'));
                                        }
                                    }}
                                    aria-label="Favoris"
                                >
                                    <Heart className="size-6 text-[#dc0000]" strokeWidth={1.25} />
                                </Button>
                                {user?.role === 'CUSTOMER' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full border-[#bfbfbf]"
                                        onClick={() => cartDrawer?.openCart()}
                                        aria-label="Panier"
                                    >
                                        <ShoppingCart className="size-5" />
                                    </Button>
                                )}
                            </>
                        )}
                        {isAdmin && (
                            <Button variant="ghost" size="icon" className="rounded-full" asChild>
                                <Link href={route('profile.edit')} aria-label="Paramètres">
                                    <User className="size-6" strokeWidth={1.25} />
                                </Link>
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="shrink-0 rounded-full text-black lg:hidden"
                            onClick={() => setMobileOpen((o) => !o)}
                            aria-expanded={mobileOpen}
                            aria-controls="home-header-mobile-menu"
                            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        >
                            {mobileOpen ? (
                                <X className="size-6" strokeWidth={1.25} />
                            ) : (
                                <Menu className="size-6" strokeWidth={1.25} />
                            )}
                        </Button>
                    </div>
                </div>

                {isAdmin && path.startsWith('/admin/products') && (
                    <div className="hidden overflow-x-auto border-t border-neutral-100 bg-[#f0f0f0] md:block [scrollbar-width:thin]">
                        <div className="mx-auto flex max-w-[1440px] flex-nowrap items-center gap-4 px-4 py-3 sm:gap-6 sm:px-8 lg:flex-wrap lg:px-[100px]">
                            {ADMIN_STOCK_NAV.map((item) => {
                                const active = item.match(path);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'font-poppins border-b-2 pb-0.5 text-base transition-colors',
                                            active
                                                ? 'border-[#0059DD] font-medium text-[#0059DD]'
                                                : 'border-transparent text-black hover:text-[#0059DD]',
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}

                {mobileOpen && (
                    <>
                        <button
                            type="button"
                            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                            aria-label="Fermer le menu"
                            onClick={closeMobileMenu}
                        />
                        <nav
                            id="home-header-mobile-menu"
                            className="absolute inset-x-0 top-full z-50 max-h-[min(75dvh,28rem)] overflow-y-auto border-t border-neutral-100 bg-white px-4 py-4 shadow-xl lg:hidden"
                        >
                        {!isAdmin && (
                            <form
                                onSubmit={submitSearch}
                                className="mb-4 flex items-center gap-3 border-b border-[#bfbfbf] pb-3"
                                role="search"
                            >
                                {searchField}
                            </form>
                        )}
                        {isAdmin
                            ? ADMIN_MAIN_NAV.map((item) => {
                                  const isActive = item.match(path);
                                  return (
                                      <Link
                                          key={item.label}
                                          href={item.href}
                                          className={cn(
                                              'font-poppins block py-2 text-base',
                                              isActive && 'font-semibold text-[#0059DD]',
                                          )}
                                          onClick={closeMobileMenu}
                                      >
                                          {item.label}
                                      </Link>
                                  );
                              })
                            : NAV_ITEMS.map((item) => {
                                  const isActive = item.key === activeNav;
                                  return (
                                      <Link
                                          key={item.label}
                                          href={item.href}
                                          className={cn(
                                              'font-poppins block py-2 text-base',
                                              isActive && 'font-semibold text-[#0059DD]',
                                          )}
                                          onClick={closeMobileMenu}
                                      >
                                          {item.label}
                                      </Link>
                                  );
                              })}
                        {isAdmin && path.startsWith('/admin/products') && (
                            <>
                                <p className="mt-4 font-poppins text-xs font-semibold uppercase tracking-wider text-[#747474]">
                                    Stocks
                                </p>
                                {ADMIN_STOCK_NAV.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            'font-poppins block py-2 text-base',
                                            item.match(path) && 'font-semibold text-[#0059DD]',
                                        )}
                                        onClick={closeMobileMenu}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </>
                        )}
                        {!isAdmin && user?.role === 'CUSTOMER' && (
                            <button
                                type="button"
                                className="font-poppins block w-full py-2 text-left text-base"
                                onClick={() => {
                                    closeMobileMenu();
                                    favoritesDrawer?.openFavorites();
                                }}
                            >
                                Mes favoris
                            </button>
                        )}
                        {!isAdmin &&
                            (user?.role === 'CUSTOMER' ? (
                                <button
                                    type="button"
                                    className="font-poppins mt-2 block w-full py-2 text-left text-base"
                                    onClick={() => {
                                        closeMobileMenu();
                                        openAccount();
                                    }}
                                >
                                    Mon compte
                                </button>
                            ) : (
                                <Link
                                    href={accountHref}
                                    className="font-poppins mt-2 block py-2 text-base"
                                    onClick={closeMobileMenu}
                                >
                                    {user ? 'Mon compte' : 'Connexion'}
                                </Link>
                            ))}
                        {isAdmin && (
                            <Link
                                href={route('profile.edit')}
                                className="font-poppins mt-2 block py-2 text-base"
                                onClick={closeMobileMenu}
                            >
                                Paramètres
                            </Link>
                        )}
                        </nav>
                    </>
                )}
            </div>
        </header>
        </>
    );
}

