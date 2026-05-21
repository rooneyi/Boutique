type Props = {
    orderId: number;
    createdAt: string;
    status: string;
    paymentMethod?: string | null;
    vendorName: string;
};

function statusLabel(status: string): string {
    const map: Record<string, string> = {
        PENDING: 'En attente',
        CONFIRMED: 'Confirmée',
        SHIPPED: 'Expédiée',
        DELIVERED: 'Livrée',
        CANCELLED: 'Annulée',
    };
    return map[status] ?? status;
}

function paymentLabel(method: string | null | undefined): string {
    if (method === 'mobile_money') {
        return 'Mobile Money';
    }
    if (method === 'cash_on_delivery') {
        return 'Paiement à la livraison';
    }
    return '—';
}

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 border-b border-[#e8e8e8] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <span className="font-poppins text-base font-medium text-[#737373]">{label}</span>
            <span className="font-poppins text-base font-semibold text-black">{value}</span>
        </div>
    );
}

export function OrderDetailsCard({
    orderId,
    createdAt,
    status,
    paymentMethod,
    vendorName,
}: Props) {
    return (
        <section className="w-full rounded-[20px] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.12)] sm:px-8">
            <h2 className="font-poppins mb-2 text-2xl font-semibold text-black">Détails commande</h2>
            <DetailRow label="N° commande" value={`#${orderId}`} />
            <DetailRow label="Date" value={createdAt} />
            <DetailRow label="Statut" value={statusLabel(status)} />
            <DetailRow label="Paiement" value={paymentLabel(paymentMethod)} />
            <DetailRow label="Boutique" value={vendorName} />
        </section>
    );
}
