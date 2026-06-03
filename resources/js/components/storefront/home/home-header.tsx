import { Link, router, usePage } from '@inertiajs/react';
import { Bell, Heart, Menu, Search, User, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { InertiaPropsSync } from '@/components/storefront/inertia-props-sync';
import { useOptionalAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { HeaderCartButton } from '@/components/storefront/header/header-cart-button';
import { HeaderFavoritesButton } from '@/components/storefront/header/header-favorites-button';
import { HeaderIconPill } from '@/components/storefront/header/header-icon-pill';
import { HomeHeaderTopBar } from '@/components/storefront/home/home-header-top-bar';
import { StorefrontLogo } from '@/components/storefront/storefront-logo';
import { ADMIN_MAIN_NAV, ADMIN_STOCK_NAV } from '@/lib/admin-nav';
import { route } from '@/lib/route';
import {
    SF_HEADER_HEART,
    SF_HEADER_ICON_MUTED,
    SF_NAV_ACTIVE_DOT,
    SF_NAV_ITEM,
    SF_NAV_ITEM_ACTIVE,
} from '@/lib/storefront-ui-styles';
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
    { key: 'about' as const, label: 'A\u00a0Propos', href: `${route('home')}#pourquoi-nous` },
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
    const accountDrawer = useOptionalAccountDrawer();

    function openAccount() {
        if (user?.role === 'CUSTOMER') {
            if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches) {
                router.visit(route('customer.account'));
                return;
            }
            accountDrawer?.openAccount();
        } else {
            router.visit(route('login'));
        }
    }

    const accountHref =
        user?.role === 'ADMIN'
            ? '/admin/dashboard'
            : user?.role === 'CUSTOMER'
              ? route('customer.account')
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
            <Search className="size-6 shrink-0 text-[#999]" aria-hidden />
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
            <HomeHeaderTopBar
                isAdmin={isAdmin}
                canRegister={canRegister}
                isGuest={!user}
                accountHref={accountHref}
            />

            <div className="relative border-b border-neutral-200 bg-white">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-8 lg:px-[100px]">
                    <StorefrontLogo
                        variant="on-light"
                        href={isAdmin ? route('admin.dashboard') : route('home')}
                        className="shrink-0"
                    />

                    <nav
                        className={cn(
                            'hidden min-w-0 flex-1 items-center justify-center gap-6 lg:flex',
                            isAdmin && 'gap-0.5 overflow-x-auto justify-start xl:gap-1 [scrollbar-width:thin]',
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
                                          {isActive ? <span className={SF_NAV_ACTIVE_DOT} /> : null}
                                      </Link>
                                  );
                              })
                            : NAV_ITEMS.map((item) => {
                                  const isActive = item.key === activeNav;
                                  return (
                                      <Link
                                          key={item.label}
                                          href={item.href}
                                          className={
                                              isActive ? SF_NAV_ITEM_ACTIVE : SF_NAV_ITEM
                                          }
                                      >
                                          {item.label}
                                          {isActive ? <span className={SF_NAV_ACTIVE_DOT} /> : null}
                                      </Link>
                                  );
                              })}
                    </nav>

                    <div className="flex shrink-0 items-center justify-end gap-[15px]">
                        {!isAdmin && (
                            <form
                                onSubmit={submitSearch}
                                className="hidden min-w-[220px] items-center gap-5 border-b border-[#bfbfbf] px-1 py-2 md:flex lg:min-w-[280px]"
                                role="search"
                            >
                                {searchField}
                            </form>
                        )}
                        {!isAdmin && (
                            <div className="hidden items-center gap-3 lg:flex">
                                <HeaderIconPill
                                    href={user ? accountHref : route('login')}
                                    aria-label="Notifications"
                                >
                                    <Bell className="size-5 text-black" strokeWidth={1.25} />
                                </HeaderIconPill>
                                {user?.role === 'CUSTOMER' ? (
                                    <HeaderFavoritesButton />
                                ) : (
                                    <HeaderIconPill
                                        aria-label="Favoris"
                                        onClick={() => router.visit(route('login'))}
                                    >
                                        <Heart className={cn('size-5', SF_HEADER_HEART)} strokeWidth={1.25} />
                                    </HeaderIconPill>
                                )}
                                <HeaderCartButton />
                            </div>
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
                                            'font-poppins border-b-2 pb-0.5 text-base transition-[color,border-color] duration-300 ease-out',
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
                            <>
                                <Link
                                    href={route('customer.favorites.index')}
                                    className="font-poppins block w-full py-2 text-base"
                                    onClick={closeMobileMenu}
                                >
                                    Mes favoris
                                </Link>
                                <Link
                                    href={route('customer.cart')}
                                    className="font-poppins block w-full py-2 text-base"
                                    onClick={closeMobileMenu}
                                >
                                    Mon panier
                                </Link>
                            </>
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

