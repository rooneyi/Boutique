import { Head, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { FlashToaster } from '@/components/flash-toaster';
import { OrderClientDetailsCard } from '@/components/storefront/orders/order-client-details-card';
import { OrderConfirmationPanel } from '@/components/storefront/orders/order-confirmation-panel';
import { OrderDetailsCard } from '@/components/storefront/orders/order-details-card';
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
                    <section className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-8 sm:py-10">
                        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
                            <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:pt-6 lg:text-left">
                                <CheckCircle2
                                    className="size-14 text-[#068130] sm:size-[78px]"
                                    strokeWidth={1.25}
                                    aria-hidden
                                />
                                <h1
                                    className={cn(
                                        SF_PAGE_TITLE,
                                        'max-w-2xl text-[clamp(1.5rem,5vw,2.25rem)]',
                                    )}
                                >
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
                            </div>

                            <div className="flex w-full shrink-0 justify-center lg:w-auto lg:justify-end">
                                <OrderConfirmationPanel
                                    order={order}
                                    whatsappPhone={whatsappPhone}
                                    supportPhone={supportPhone}
                                    supportEmail={supportEmail}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pb-16 sm:gap-8 sm:px-8">
                        <OrderDetailsCard
                            orderId={order.id}
                            createdAt={order.created_at}
                            status={order.status}
                            paymentMethod={order.payment_method}
                            vendorName={order.vendor.shop_name}
                        />

                        <OrderRecapPanel
                            items={order.items}
                            subtotal={subtotal}
                            shipping={shipping}
                            total={order.total_amount}
                            className="w-full rounded-[20px] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.12)] sm:px-8"
                        />

                        <OrderClientDetailsCard
                            name={order.shipping_full_name}
                            whatsapp={order.shipping_whatsapp}
                            address={order.shipping_address}
                            city={order.shipping_city}
                            district={order.shipping_district}
                            note={order.customer_note}
                        />
                    </section>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
