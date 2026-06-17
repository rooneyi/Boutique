import { useEffect, useRef, type RefObject } from 'react';
import { AccountMenuNavGuest } from '@/components/storefront/account/account-menu-nav';
import { getStorefrontCanRegister } from '@/lib/storefront-page-props';
import { cn } from '@/lib/utils';

type Props = {
    open: boolean;
    onClose: () => void;
    anchorRef: RefObject<HTMLElement | null>;
    className?: string;
};

/** Menu connexion — ancré sous le bouton « Se connecter » de la barre noire. */
export function AccountGuestPanel({ open, onClose, anchorRef, className }: Props) {
    const panelRef = useRef<HTMLDivElement>(null);
    const canRegister = getStorefrontCanRegister();

    useEffect(() => {
        if (!open) {
            return;
        }

        function handlePointerDown(event: MouseEvent) {
            const target = event.target as Node;
            if (panelRef.current?.contains(target) || anchorRef.current?.contains(target)) {
                return;
            }
            onClose();
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                onClose();
            }
        }

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onClose, anchorRef]);

    if (!open) {
        return null;
    }

    return (
        <div
            ref={panelRef}
            role="dialog"
            aria-label="Se connecter"
            className={cn(
                'absolute top-full right-0 z-[70] mt-0 w-[min(calc(100vw-2rem),300px)] overflow-hidden rounded-b-xl border border-neutral-100 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
                className,
            )}
        >
            <div className="py-1">
                <AccountMenuNavGuest
                    canRegister={canRegister}
                    onNavigate={onClose}
                    compact
                />
            </div>
        </div>
    );
}
