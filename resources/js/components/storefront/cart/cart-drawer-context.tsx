import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { preview as cartPreview } from '@/routes/customer/cart';
import type { CartLine, CartPreview } from '@/components/storefront/cart/cart-types';

type CartDrawerContextValue = {
    open: boolean;
    lines: CartLine[];
    total: number;
    count: number;
    loading: boolean;
    openCart: () => void;
    closeCart: () => void;
    refresh: () => Promise<void>;
};

const CartDrawerContext = createContext<CartDrawerContextValue | null>(null);

export function CartDrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [lines, setLines] = useState<CartLine[]>([]);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const applyPreview = useCallback((data: CartPreview) => {
        setLines(data.lines);
        setTotal(data.total);
        setCount(data.count);
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(cartPreview.url(), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (!response.ok) {
                return;
            }
            const data = (await response.json()) as CartPreview;
            applyPreview(data);
        } finally {
            setLoading(false);
        }
    }, [applyPreview]);

    const openCart = useCallback(() => {
        setOpen(true);
        void refresh();
    }, [refresh]);

    const closeCart = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(
        () => ({
            open,
            lines,
            total,
            count,
            loading,
            openCart,
            closeCart,
            refresh,
        }),
        [open, lines, total, count, loading, openCart, closeCart, refresh],
    );

    return (
        <CartDrawerContext.Provider value={value}>{children}</CartDrawerContext.Provider>
    );
}

export function useCartDrawer(): CartDrawerContextValue {
    const ctx = useContext(CartDrawerContext);
    if (!ctx) {
        throw new Error('useCartDrawer must be used within CartDrawerProvider');
    }

    return ctx;
}

export function useOptionalCartDrawer(): CartDrawerContextValue | null {
    return useContext(CartDrawerContext);
}
