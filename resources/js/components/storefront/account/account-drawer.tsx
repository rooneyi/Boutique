import { router } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { AccountMenuNav } from '@/components/storefront/account/account-menu-nav';
import { AccountProfileSection } from '@/components/storefront/account/account-profile-section';
import { useAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { route } from '@/lib/route';
import { getStorefrontAuthUser } from '@/lib/storefront-page-props';

/** Tiroir latéral « Mon compte » — clients connectés uniquement (invités : panneau sous le header). */
export function AccountDrawer() {
    const { open, closeAccount, account, loading } = useAccountDrawer();
    const isCustomer = getStorefrontAuthUser()?.role === 'CUSTOMER';

    if (!isCustomer) {
        return null;
    }

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeAccount()}>
            <SheetContent
                side="right"
                size="wide"
                showCloseButton={false}
                className="flex flex-col overflow-hidden border-0 bg-white p-0"
                overlayClassName="bg-black/60 backdrop-blur-[2px]"
            >
                <div className="relative shrink-0 px-5 pt-10">
                    <SheetTitle className="font-poppins text-[36px] font-semibold leading-normal text-black">
                        Mon compte
                    </SheetTitle>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-[52px] right-[26px] size-10 rounded-full text-black hover:bg-neutral-100"
                        onClick={closeAccount}
                        aria-label="Fermer"
                    >
                        <X className="size-10" strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    Profil et paramètres de votre compte client
                </SheetDescription>

                <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-10">
                    {loading && !account ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="size-8 animate-spin text-[#737373]" aria-hidden />
                        </div>
                    ) : account ? (
                        <div className="mx-auto max-w-[751px] px-[18px]">
                            <AccountProfileSection account={account} compact />
                            <div className="mt-2">
                                <AccountMenuNav onNavigate={closeAccount} compact />
                            </div>
                            
                        </div>
                    ) : null}
                </div>
            </SheetContent>
        </Sheet>
    );
}
