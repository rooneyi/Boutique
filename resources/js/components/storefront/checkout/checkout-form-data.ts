export type DeliveryMethod = 'home_delivery' | 'store_pickup';

export type PaymentMethod = 'mobile_money' | 'cash_on_delivery';

export type PaymentProvider = 'airtel' | 'orange' | 'mpesa' | 'card' | null;

export type CheckoutFormData = {
    delivery_method: DeliveryMethod;
    shipping_full_name: string;
    shipping_whatsapp: string;
    shipping_address: string;
    shipping_city: string;
    shipping_district: string;
    payment_method: PaymentMethod;
    payment_provider: PaymentProvider;
    payment_phone: string;
    customer_note: string;
};

export type CheckoutStep = 'shipping' | 'payment';
