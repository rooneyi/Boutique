import { Head, Link, usePage } from '@inertiajs/react';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    is_vendor?: boolean;
    is_admin?: boolean;
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
};

export default function Welcome() {
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    const dashboardHref = user?.is_admin
        ? '/admin/dashboard'
        : user?.is_vendor
          ? '/vendor/dashboard'
          : '/customer/products';

    return (
        <>
            <Head title="Boutique - Multi Vendor">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="min-h-screen bg-slate-50 text-slate-900"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
                <div className="relative overflow-hidden">
                    <div className="absolute -top-40 left-[-12rem] h-96 w-96 rounded-full bg-amber-300/40 blur-3xl" />
                    <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl" />

                    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-bold text-white">B</div>
                            <div>
                                <p className="text-base font-bold leading-none">Boutique</p>
                                <p className="text-xs text-slate-500">Plateforme multi-vendeur</p>
                            </div>
                        </div>

                        <nav className="flex items-center gap-3">
                            {user ? (
                                <Link
                                    href={dashboardHref}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                >
                                    Aller au tableau de bord
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white"
                                    >
                                        Connexion
                                    </Link>
                                    <Link
                                        href="/auth/register-customer"
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                                    >
                                        Creer un compte
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="mx-auto grid w-full max-w-6xl gap-8 px-6 pb-16 pt-10 lg:grid-cols-2 lg:items-center">
                        <section>
                            <p className="mb-4 inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                E-commerce local et scalable
                            </p>
                            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                                Vendez, achetez, et pilotez votre boutique en un seul endroit.
                            </h1>
                            <p className="mt-5 max-w-xl text-lg text-slate-600">
                                Une experience simple pour les clients, des outils efficaces pour les vendeurs,
                                et une vision globale pour les administrateurs.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Link
                                    href="/auth/register-vendor"
                                    className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500"
                                >
                                    Ouvrir ma boutique
                                </Link>
                                <Link
                                    href="/customer/products"
                                    className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                >
                                    Explorer les produits
                                </Link>
                                <Link
                                    href="/admin/login"
                                    className="rounded-xl border border-slate-900 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
                                >
                                    Espace Admin
                                </Link>
                            </div>
                        </section>

                        <section className="grid gap-4 sm:grid-cols-2">
                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vendeurs</p>
                                <h2 className="mt-2 text-xl font-bold">Gestion produits</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Creez, mettez a jour votre catalogue et suivez votre stock en temps reel.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Clients</p>
                                <h2 className="mt-2 text-xl font-bold">Achat simplifie</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Recherchez, filtrez, consultez les details et passez commande rapidement.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Administration</p>
                                <h2 className="mt-2 text-xl font-bold">Vision globale</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Suivez les vendeurs, surveillez les stocks sensibles et analysez les performances globales.
                                </p>
                            </article>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
