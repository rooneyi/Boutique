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
import { cn } from '@/lib/utils';

export function AccountDrawer() {
    const { open, closeAccount, account, loading } = useAccountDrawer();
    const canRegister = getStorefrontCanRegister();
    const isCustomer = getStorefrontAuthUser()?.role === 'CUSTOMER';
    const isGuestDrawer = !isCustomer;

    const drawerTitle = isCustomer ? 'Mon compte' : 'Se connecter';

    return (
        <Sheet open={open} onOpenChange={(next) => !next && closeAccount()}>
            <SheetContent
                side="right"
                size={isGuestDrawer ? 'default' : 'wide'}
                showCloseButton={false}
                className="flex flex-col overflow-hidden border-0 bg-white p-0"
                overlayClassName="bg-black/60 backdrop-blur-[2px]"
            >
                <div className={cn('relative shrink-0', isGuestDrawer ? 'px-4 pt-6' : 'px-5 pt-10')}>
                    <SheetTitle
                        className={cn(
                            'font-poppins font-semibold leading-normal text-black',
                            isGuestDrawer ? 'text-2xl' : 'text-[36px]',
                        )}
                    >
                        {drawerTitle}
                    </SheetTitle>
                    {isGuestDrawer && (
                        <p className="font-poppins mt-1 text-sm text-[#737373]">
                            Connectez-vous ou créez un compte pour continuer.
                        </p>
                    )}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            'absolute size-9 rounded-full text-black hover:bg-neutral-100',
                            isGuestDrawer ? 'top-5 right-3' : 'top-[52px] right-[26px] size-10',
                        )}
                        onClick={closeAccount}
                        aria-label="Fermer"
                    >
                        <X className={cn(isGuestDrawer ? 'size-6' : 'size-10')} strokeWidth={1.25} />
                    </Button>
                </div>

                <SheetDescription className="sr-only">
                    {isCustomer ? 'Profil et paramètres de votre compte client' : 'Connectez-vous ou créez un compte'}
                </SheetDescription>

                <div className={cn('min-h-0 flex-1 overflow-y-auto pb-10', isGuestDrawer ? 'px-4' : 'px-5')}>
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
                        <AccountMenuNavGuest
                            canRegister={canRegister}
                            onNavigate={closeAccount}
                            compact
                        />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
