import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from '@/components/storefront/add-to-cart-button';
import { FavoriteButton } from '@/components/storefront/favorite-button';
import { StarRatingDisplay } from '@/components/storefront/star-rating-display';
import {
    ArrowRight,
    Footprints,
    Gem,
    Glasses,
    Heart,
    Menu,
    Search,
    Shirt,
    ShoppingCart,
    Sparkles,
    Watch,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import {
    SF_BTN_PRIMARY,
    SF_CARD,
    SF_HERO_KICKER,
    SF_HERO_TITLE,
    SF_INPUT,
    SF_MUTED_ON_DARK,
    SF_NAV_LINK,
    SF_BRAND,
    SF_BRAND_SHORT,
} from '@/lib/storefront-ui-styles';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

type FeaturedProduct = {
    id: number;
    name: string;
    price: number;
    image_path: string | null;
    vendor_shop: string;
    category: string;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

type HighlightCategory = {
    id: number;
    name: string;
    count: number;
};

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    featuredProducts: FeaturedProduct[];
    highlightCategories: HighlightCategory[];
    auth?: {
        user?: AuthUser | null;
    };
};

const CATEGORY_ICONS = [Shirt, Footprints, Watch, Sparkles, Gem, Glasses];

export default function Welcome() {
    const { auth, canRegister, featuredProducts, highlightCategories } = usePage<PageProps>().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    const closeMobile = () => setMobileOpen(false);

    const accountHref =
        user?.role === 'ADMIN'
            ? '/admin/dashboard'
            : user?.role === 'VENDOR'
              ? '/vendor/dashboard'
              : user?.role === 'CUSTOMER'
                ? route('customer.products.index')
                : route('login');

    const accountLabel = user
        ? user.role === 'CUSTOMER'
            ? 'Ma boutique'
            : 'Tableau de bord'
        : 'Connexion';

    return (
        <>
            <Head title={`${SF_BRAND_SHORT} · Mode & style`} />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white">
                    <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                        <Link href={route('home')} className="flex flex-col leading-tight">
                            <span className="text-xl font-semibold tracking-tight">{SF_BRAND}</span>
                            <span className="text-xs font-normal text-[#747474]">{SF_BRAND_SHORT}</span>
                        </Link>

                        <div className="hidden max-w-md flex-1 px-6 md:block">
                            <div className="relative">
                                <input type="search" placeholder="Rechercher…" className={SF_INPUT} readOnly />
                                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#747474]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button type="button" variant="ghost" size="icon" className="hidden rounded-sm md:inline-flex" asChild>
                                <Link
                                    href={user?.role === 'CUSTOMER' ? route('customer.favorites.index') : route('login')}
                                    aria-label="Mes favoris"
                                >
                                    <Heart className="h-5 w-5" />
                                </Link>
                            </Button>
                            {user?.role === 'CUSTOMER' && (
                                <Button type="button" variant="ghost" size="icon" className="hidden rounded-sm md:inline-flex" asChild>
                                    <Link href={route('customer.cart')} aria-label="Panier">
                                        <ShoppingCart className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}

                            <Button className={cn(SF_BTN_PRIMARY, 'hidden text-base sm:inline-flex')} size="sm" asChild>
                                <Link href={accountHref}>{accountLabel}</Link>
                            </Button>

                            {canRegister && !user && (
                                <Button variant="outline" className="hidden rounded-sm sm:inline-flex" size="sm" asChild>
                                    <Link href={route('auth.customer.register')}>Créer un compte</Link>
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="rounded-sm md:hidden"
                                aria-label="Menu"
                                onClick={() => setMobileOpen(true)}
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </header>

                {mobileOpen && (
                    <div className="fixed inset-0 z-[60] md:hidden">
                        <button type="button" className="absolute inset-0 bg-black/40" aria-label="Fermer" onClick={closeMobile} />
                        <div className="absolute right-0 top-0 flex h-full w-[min(100%,300px)] flex-col bg-white shadow-lg">
                            <div className="flex items-center justify-between border-b px-4 py-3">
                                <span className="font-semibold">Menu</span>
                                <Button type="button" variant="ghost" size="icon" className="rounded-sm" onClick={closeMobile}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <nav className="flex flex-col gap-1 p-4">
                                <Link href={route('home')} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                    Accueil
                                </Link>
                                <Link href={route('customer.products.index')} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                    Catalogue
                                </Link>
                                {user?.role === 'CUSTOMER' && (
                                    <>
                                        <Link href={route('customer.favorites.index')} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                            Mes favoris
                                        </Link>
                                        <Link href={route('customer.cart')} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                            Panier
                                        </Link>
                                        <Link href={route('customer.orders.index')} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                            Mes commandes
                                        </Link>
                                    </>
                                )}
                                <Link href={accountHref} className={cn(SF_NAV_LINK, 'py-2')} onClick={closeMobile}>
                                    {accountLabel}
                                </Link>
                                {canRegister && !user && (
                                    <Link
                                        href={route('auth.customer.register')}
                                        className={cn(SF_NAV_LINK, 'py-2')}
                                        onClick={closeMobile}
                                    >
                                        Créer un compte
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                )}

                <section className="relative overflow-hidden bg-neutral-900 py-16 text-white md:py-24">
                    <div className="pointer-events-none absolute inset-0 opacity-20">
                        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0059DD] blur-3xl" />
                        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-[#0059DD] blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
                        <div className="grid gap-12 md:grid-cols-2 md:items-center">
                            <div className="space-y-8">
                                <p className={SF_HERO_KICKER}>Bienvenue chez {SF_BRAND_SHORT}</p>
                                <h1 className={SF_HERO_TITLE}>Posez votre style, sans compromis</h1>
                                <p className={SF_MUTED_ON_DARK}>
                                    Une sélection mode pensée pour vous — créateurs indépendants, pièces soignées, esprit affirmé.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Link href={route('customer.products.index')} className={SF_BTN_PRIMARY}>
                                        Voir le catalogue
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={route('auth.customer.register')}
                                            className="font-poppins inline-flex items-center justify-center gap-2 rounded-sm border border-white px-5 py-2.5 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                                        >
                                            Créer un compte
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="hidden items-center justify-center md:flex">
                                <div className="flex h-64 w-64 items-center justify-center rounded-sm border border-white/10 bg-white/5">
                                    <Shirt className="h-32 w-32 text-[#0059DD]" strokeWidth={1} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="categories" className="border-b border-neutral-100 bg-neutral-50 py-14 md:py-20">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
                        <div className="mb-10 text-center">
                            <h2 className="font-poppins text-3xl font-semibold tracking-tight text-black md:text-4xl">Rayons</h2>
                            <p className="mt-2 font-poppins text-base text-[#747474]">Parcourez nos univers</p>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {highlightCategories.length === 0 ? (
                                <p className="col-span-full text-center text-[#747474]">Catégories bientôt disponibles.</p>
                            ) : (
                                highlightCategories.map((cat, i) => {
                                    const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
                                    return (
                                        <Link
                                            key={cat.id}
                                            href={route('customer.products.index')}
                                            className={cn(
                                                SF_CARD,
                                                'flex items-center gap-4 p-5 text-left font-poppins hover:border-[#0059DD]/40',
                                            )}
                                        >
                                            <Icon className="h-10 w-10 shrink-0 text-[#0059DD]" strokeWidth={1.5} />
                                            <div>
                                                <h3 className="font-semibold text-black">{cat.name}</h3>
                                                <p className="text-sm text-[#747474]">{cat.count} article(s)</p>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </section>

                <section className="py-14 md:py-20">
                    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
                        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h2 className="font-poppins text-3xl font-semibold tracking-tight text-black md:text-4xl">Sélection</h2>
                                <p className="mt-2 font-poppins text-base text-[#747474]">Coup de cœur du moment</p>
                            </div>
                            <Link
                                href={route('customer.products.index')}
                                className="font-poppins inline-flex items-center gap-2 text-base font-semibold text-[#0059DD] hover:underline"
                            >
                                Tout voir
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {featuredProducts.length === 0 ? (
                            <p className="rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-8 text-center text-[#747474]">
                                Aucun produit pour l’instant — revenez vite.
                            </p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {featuredProducts.map((product) => (
                                    <div key={product.id} className={cn(SF_CARD, 'overflow-hidden')}>
                                        <div className="relative aspect-square bg-neutral-100">
                                            <Link href={route('customer.products.show', product.id)} className="block h-full">
                                                {product.image_path ? (
                                                    <img src={product.image_path} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center">
                                                        <ShoppingCart className="h-14 w-14 text-neutral-300" />
                                                    </div>
                                                )}
                                            </Link>
                                            <div className="absolute right-2 top-2 rounded-sm bg-white/90 shadow-sm">
                                                <FavoriteButton productId={product.id} favorited={product.is_favorite} />
                                            </div>
                                        </div>
                                        <div className="space-y-3 p-4">
                                            <p className="text-xs font-medium uppercase tracking-wide text-[#747474]">{product.vendor_shop}</p>
                                            <Link href={route('customer.products.show', product.id)}>
                                                <h3 className="line-clamp-2 font-semibold text-black hover:text-[#0059DD]">{product.name}</h3>
                                            </Link>
                                            <StarRatingDisplay value={product.rating_avg} count={product.reviews_count} />
                                            <p className="text-lg font-semibold text-black">€{product.price.toFixed(2)}</p>
                                            <AddToCartButton productId={product.id} className="w-full justify-center text-base" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                <footer className="border-t border-neutral-200 bg-neutral-50">
                    <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6">
                        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-lg font-semibold">{SF_BRAND}</p>
                                <p className="text-sm text-[#747474]">{SF_BRAND_SHORT}</p>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm">
                                <Link href={route('customer.products.index')} className="text-[#747474] hover:text-[#0059DD]">
                                    Catalogue
                                </Link>
                                <Link href="/auth/vendor/register" className="text-[#747474] hover:text-[#0059DD]">
                                    Devenir vendeur
                                </Link>
                                <Link href={route('login')} className="text-[#747474] hover:text-[#0059DD]">
                                    Connexion
                                </Link>
                            </div>
                        </div>
                        <p className="mt-8 border-t border-neutral-200 pt-6 text-center text-sm text-[#747474]">
                            © {new Date().getFullYear()} {SF_BRAND}. Tous droits réservés.
                        </p>
                    </div>
                </footer>

                <FlashToaster />
            </div>
        </>
    );
}
