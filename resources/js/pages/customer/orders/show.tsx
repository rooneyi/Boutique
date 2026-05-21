import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { FlashToaster } from '@/components/flash-toaster';
import { OrderConfirmationPanel } from '@/components/storefront/orders/order-confirmation-panel';
import { OrderRecapPanel } from '@/components/storefront/orders/order-recap-panel';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
    image_path: string | null;
};

type Order = {
    id: number;
    total_amount: number;
    status: string;
    created_at: string;
    shipping_full_name?: string | null;
    shipping_whatsapp?: string | null;
    shipping_address?: string | null;
    shipping_city?: string | null;
    shipping_district?: string | null;
    payment_method?: string | null;
    customer_note?: string | null;
    vendor: { shop_name: string };
    items: OrderItem[];
};

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    order: Order;
    subtotal: number;
    shipping: number;
    canRegister: boolean;
    whatsappPhone: string;
    supportPhone: string;
    supportEmail: string;
    auth?: { user?: AuthUser | null };
};

export default function CustomerOrderShow() {
    const {
        auth,
        canRegister,
        order,
        subtotal,
        shipping,
        whatsappPhone,
        supportPhone,
        supportEmail,
    } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Commande confirmée · PCJ" />

            <div className="min-h-screen bg-[#f8f7f9] font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-4 py-8 text-center sm:px-2 sm:py-10">
                        <CheckCircle2
                            className="size-14 text-[#068130] sm:size-[78px]"
                            strokeWidth={1.25}
                            aria-hidden
                        />
                        <h1 className={cn(SF_PAGE_TITLE, 'max-w-2xl text-[clamp(1.5rem,5vw,2.25rem)]')}>
                            Commande enregistrée avec succès !
                        </h1>
                        <div className="max-w-xl text-sm leading-relaxed text-black sm:text-base">
                            <p>Merci pour votre confiance.</p>
                            <p>
                                Nous avons bien reçu votre commande et nous vous contacterons
                                bientôt.
                            </p>
                        </div>
                        <p className="text-sm text-[rgba(91,94,100,0.62)]">
                            Commande #{order.id} · {order.vendor.shop_name}
                        </p>
                    </section>

                    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-4 sm:gap-8 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
                        <OrderRecapPanel
                            items={order.items}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={order.total_amount}
                        />
                        <OrderConfirmationPanel
                            order={order}
                            whatsappPhone={whatsappPhone}
                            supportPhone={supportPhone}
                            supportEmail={supportEmail}
                        />
                    </section>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
