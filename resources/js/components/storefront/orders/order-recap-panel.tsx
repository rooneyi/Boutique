type OrderItem = {
    product_name: string;
    quantity: number;
    line_total: number;
    image_path: string | null;
};

type Props = {
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    className?: string;
};

function formatMoney(amount: number): string {
    return `${amount.toFixed(2)} $`;
}

export function OrderRecapPanel({ items, subtotal, shipping, total, className }: Props) {
    return (
        <div
            className={
                className ??
                'w-full max-w-[596px] rounded-[20px] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.25)]'
            }
        >
            <h2 className="font-poppins mb-5 text-2xl font-semibold text-black">
                Récapitulatif de commande
            </h2>

            <div className="space-y-5">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-5">
                        <div className="h-[120px] w-[117px] shrink-0 overflow-hidden rounded-[20px] bg-neutral-100">
                            {item.image_path ? (
                                <img
                                    src={item.image_path}
                                    alt=""
                                    className="size-full object-cover"
                                />
                            ) : (
                                <div className="flex size-full items-center justify-center text-xs text-[#737373]">
                                    —
                                </div>
                            )}
                        </div>
                        <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                            <div>
                                <p className="font-poppins text-xl font-medium text-black">
                                    {item.product_name}
                                </p>
                                <p className="mt-1 text-sm text-[rgba(91,94,100,0.62)]">Tailles : M</p>
                                <p className="text-sm text-[rgba(91,94,100,0.62)]">Couleur : Blanc</p>
                                <p className="text-sm text-[rgba(91,94,100,0.62)]">
                                    Quantité : {item.quantity}
                                </p>
                            </div>
                            <p className="font-poppins shrink-0 text-xl font-medium text-[#0059DD]">
                                {formatMoney(item.line_total)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="my-6 space-y-5 border-y border-neutral-100 py-6 text-lg text-black">
                <div className="flex items-center justify-between">
                    <span>Sous-total</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span>Livraison</span>
                    <span className="text-[rgba(91,94,100,0.62)]">
                        {shipping <= 0 ? 'free' : formatMoney(shipping)}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4">
                <span className="font-poppins text-3xl font-semibold text-black">Total</span>
                <span className="font-poppins text-3xl font-semibold text-black">
                    {formatMoney(total)}
                </span>
            </div>
        </div>
    );
}
