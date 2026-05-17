import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { toast } from 'sonner';
import { preview as accountPreview } from '@/routes/customer/account';
import type { AccountPreview } from '@/components/storefront/account/account-types';

type AccountDrawerContextValue = {
    open: boolean;
    account: AccountPreview | null;
    loading: boolean;
    openAccount: () => void;
    closeAccount: () => void;
    refresh: () => Promise<void>;
};

const AccountDrawerContext = createContext<AccountDrawerContextValue | null>(null);

export function AccountDrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [account, setAccount] = useState<AccountPreview | null>(null);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(accountPreview.url(), {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.status === 401 || response.status === 403) {
                setAccount(null);
                toast.error('Connectez-vous pour accéder à votre compte.');
                return;
            }

            if (!response.ok) {
                toast.error('Impossible de charger votre compte.');
                return;
            }

            setAccount((await response.json()) as AccountPreview);
        } catch {
            toast.error('Impossible de charger votre compte.');
        } finally {
            setLoading(false);
        }
    }, []);

    const openAccount = useCallback(() => {
        setOpen(true);
        void refresh();
    }, [refresh]);

    const closeAccount = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(
        () => ({
            open,
            account,
            loading,
            openAccount,
            closeAccount,
            refresh,
        }),
        [open, account, loading, openAccount, closeAccount, refresh],
    );

    return (
        <AccountDrawerContext.Provider value={value}>
            {children}
        </AccountDrawerContext.Provider>
    );
}

export function useAccountDrawer(): AccountDrawerContextValue {
    const ctx = useContext(AccountDrawerContext);
    if (!ctx) {
        throw new Error('useAccountDrawer must be used within AccountDrawerProvider');
    }

    return ctx;
}

export function useOptionalAccountDrawer(): AccountDrawerContextValue | null {
    return useContext(AccountDrawerContext);
}
