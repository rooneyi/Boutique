import { router } from '@inertiajs/react';
import { Loader2, X } from 'lucide-react';
import { AccountMenuNav, AccountMenuNavGuest } from '@/components/storefront/account/account-menu-nav';
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
import { getStorefrontAuthUser, getStorefrontCanRegister } from '@/lib/storefront-page-props';

export function AccountDrawer() {
    const { open, closeAccount, account, loading } = useAccountDrawer();
    const canRegister = getStorefrontCanRegister();
    const isCustomer = getStorefrontAuthUser()?.role === 'CUSTOMER';

    const drawerTitle = isCustomer ? 'Mon compte' : 'Se connecter';

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
                        {drawerTitle}
                    </SheetTitle>
                    {!isCustomer && (
                        <p className="font-poppins mt-1 text-sm text-[#737373]">
                            Connectez-vous ou créez un compte pour continuer.
                        </p>
                    )}
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
                    {isCustomer ? 'Profil et paramètres de votre compte client' : 'Connectez-vous ou créez un compte'}
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
                            <Button
                                type="button"
                                variant="link"
                                className="font-poppins mx-auto mt-6 flex text-base font-semibold text-[#0059DD]"
                                onClick={() => {
                                    closeAccount();
                                    router.visit(route('customer.account'));
                                }}
                            >
                                Voir la page complète
                            </Button>
                        </div>
                    ) : (
                        <div className="mx-auto max-w-[751px] px-[18px]">
                            <AccountMenuNavGuest
                                canRegister={canRegister}
                                onNavigate={closeAccount}
                            />
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
