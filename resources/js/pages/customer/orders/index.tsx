import { Head, Link, usePage } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { Button } from '@/components/ui/button';
import { route } from '@/lib/route';
import {
    SF_BTN_PRIMARY,
    SF_LIST_ROW,
    SF_MOBILE_META,
    SF_MUTED,
    SF_PAGE_MAIN,
    SF_PAGE_SECTION,
    SF_PAGE_TITLE,
} from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type Order = {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
};

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    orders: {
        data: Order[];
    };
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

function statusLabel(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('paid') || s.includes('payé')) {
        return 'Payée';
    }
    if (s.includes('cancel')) {
        return 'Annulée';
    }
    if (s.includes('pend') || s.includes('attent')) {
        return 'En attente';
    }
    return status;
}

function statusTone(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('paid') || s.includes('payé')) {
        return 'border-[#0059DD]/15 bg-[#0059DD]/10 text-[#0059DD]';
    }
    if (s.includes('cancel')) {
        return 'border-[#dc0000]/15 bg-[#dc0000]/8 text-[#c40000]';
    }
    return 'border-neutral-200 bg-neutral-50 text-neutral-600';
}

export default function Orders() {
    const { auth, canRegister, orders } = usePage<PageProps>().props;

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    return (
        <>
            <Head title="Mes commandes · PCJ" />

            <div className="min-h-screen bg-[#f8f7f9] font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className={cn(SF_PAGE_SECTION, 'mx-auto max-w-[1440px]')}>
                        <div>
                            <h1 className={SF_PAGE_TITLE}>Mes commandes</h1>
                            <p className={cn(SF_MUTED, 'mt-2')}>
                                Historique de vos achats et suivi
                            </p>
                        </div>

                        {orders.data.length > 0 ? (
                            <ul className="space-y-3">
                                {orders.data.map((order) => (
                                    <li
                                        key={order.id}
                                        className={cn(
                                            SF_LIST_ROW,
                                            'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
                                        )}
                                    >
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-poppins text-lg font-semibold text-black">
                                                    Commande #{order.id}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'font-poppins inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                                        statusTone(order.status),
                                                    )}
                                                >
                                                    {statusLabel(order.status)}
                                                </span>
                                            </div>
                                            <p className={SF_MOBILE_META}>Date</p>
                                            <p className={cn(SF_MUTED, 'text-sm md:text-base')}>
                                                {formatDate(order.created_at)}
                                            </p>
                                            <p className="font-poppins text-base font-semibold text-[#0059DD] sm:hidden">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                                            <p className="hidden font-poppins text-xl font-semibold text-[#0059DD] sm:block">
                                                ${Number(order.total_amount).toFixed(2)}
                                            </p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="font-poppins rounded-full border-black"
                                                asChild
                                            >
                                                <Link href={route('customer.orders.show', order.id)}>
                                                    <Eye className="mr-2 size-4" />
                                                    Détail
                                                </Link>
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="py-16 text-center">
                                <p className={cn(SF_MUTED, 'text-lg')}>
                                    Vous n&apos;avez pas encore de commandes.
                                </p>
                                <Button className={cn(SF_BTN_PRIMARY, 'mt-6')} asChild>
                                    <Link href={route('customer.products.index')}>
                                        Commencer à acheter
                                    </Link>
                                </Button>
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
