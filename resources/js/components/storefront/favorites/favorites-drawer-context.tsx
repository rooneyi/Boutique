import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { preview as favoritesPreview } from '@/routes/customer/favorites';
import type { FavoriteProduct, FavoritesPreview } from '@/components/storefront/favorites/favorites-types';

type FavoritesDrawerContextValue = {
    open: boolean;
    products: FavoriteProduct[];
    count: number;
    loading: boolean;
    openFavorites: () => void;
    closeFavorites: () => void;
    refresh: () => Promise<void>;
};

const FavoritesDrawerContext = createContext<FavoritesDrawerContextValue | null>(null);

export function FavoritesDrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<FavoriteProduct[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const applyPreview = useCallback((data: FavoritesPreview) => {
        setProducts(data.products);
        setCount(data.count);
    }, []);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(favoritesPreview.url(), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (!response.ok) {
                return;
            }
            const data = (await response.json()) as FavoritesPreview;
            applyPreview(data);
        } finally {
            setLoading(false);
        }
    }, [applyPreview]);

    const openFavorites = useCallback(() => {
        setOpen(true);
        void refresh();
    }, [refresh]);

    const closeFavorites = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(
        () => ({
            open,
            products,
            count,
            loading,
            openFavorites,
            closeFavorites,
            refresh,
        }),
        [open, products, count, loading, openFavorites, closeFavorites, refresh],
    );

    return (
        <FavoritesDrawerContext.Provider value={value}>
            {children}
        </FavoritesDrawerContext.Provider>
    );
}

export function useFavoritesDrawer(): FavoritesDrawerContextValue {
    const ctx = useContext(FavoritesDrawerContext);
    if (!ctx) {
        throw new Error('useFavoritesDrawer must be used within FavoritesDrawerProvider');
    }

    return ctx;
}

export function useOptionalFavoritesDrawer(): FavoritesDrawerContextValue | null {
    return useContext(FavoritesDrawerContext);
}
