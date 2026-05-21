export type CartLine = {
    product_id: number;
    variant_id?: number | null;
    quantity: number;
    name: string;
    price: number;
    line_total: number;
    image_path: string | null;
    vendor_shop: string;
    vendor_id: number;
    stock: number;
    is_favorite?: boolean;
};

export type CartPreview = {
    lines: CartLine[];
    total: number;
    count: number;
};
