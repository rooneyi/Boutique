import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

type NotificationsDrawerContextValue = {
    open: boolean;
    openNotifications: () => void;
    closeNotifications: () => void;
};

const NotificationsDrawerContext =
    createContext<NotificationsDrawerContextValue | null>(null);

export function NotificationsDrawerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const openNotifications = useCallback(() => {
        setOpen(true);
    }, []);

    const closeNotifications = useCallback(() => {
        setOpen(false);
    }, []);

    const value = useMemo(
        () => ({
            open,
            openNotifications,
            closeNotifications,
        }),
        [open, openNotifications, closeNotifications],
    );

    return (
        <NotificationsDrawerContext.Provider value={value}>
            {children}
        </NotificationsDrawerContext.Provider>
    );
}

export function useNotificationsDrawer(): NotificationsDrawerContextValue {
    const ctx = useContext(NotificationsDrawerContext);
    if (!ctx) {
        throw new Error(
            'useNotificationsDrawer must be used within NotificationsDrawerProvider',
        );
    }

    return ctx;
}

export function useOptionalNotificationsDrawer(): NotificationsDrawerContextValue | null {
    return useContext(NotificationsDrawerContext);
}
