export type CartLine = {
    product_id: number;
    quantity: number;
    name: string;
    price: number;
    line_total: number;
    image_path: string | null;
    vendor_shop: string;
    stock: number;
};

export type CartPreview = {
    lines: CartLine[];
    total: number;
    count: number;
};
