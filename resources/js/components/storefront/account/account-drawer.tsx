import { router } from '@inertiajs/react';
import {
    Gift,
    Headphones,
    Loader2,
    LogOut,
    MapPin,
    Package,
    Settings,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { AccountDrawerMenuItem } from '@/components/storefront/account/account-drawer-menu-item';
import { useAccountDrawer } from '@/components/storefront/account/account-drawer-context';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { HOME_ASSETS } from '@/lib/home-assets';
import { route } from '@/lib/route';

export function AccountDrawer() {
    const { open, closeAccount, account, loading } = useAccountDrawer();

    function handlePlaceholder(label: string) {
        toast.message(`${label}`, {
            description: 'Cette section sera disponible prochainement.',
        });
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
                        aria-label="Fermer le compte"
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
                            <div className="flex flex-col items-center gap-1.5 px-2.5 py-4">
                                <div className="size-[159px] overflow-hidden rounded-full bg-neutral-200">
                                    {account.avatar_url ? (
                                        <img
                                            src={account.avatar_url}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <img
                                            src={HOME_ASSETS.heroModel}
                                            alt=""
                                            className="size-full object-cover"
                                        />
                                    )}
                                </div>
                                <p className="font-poppins text-2xl font-semibold text-black">
                                    {account.name}
                                </p>
                                <p className="font-poppins text-xl text-[#999]">
                                    {account.phone}
                                </p>

                                <div className="mt-2 flex items-center justify-center">
                                    <div className="flex flex-col items-center px-3 py-2.5">
                                        <p className="font-poppins text-[32px] font-semibold text-black">
                                            {account.orders_count}
                                        </p>
                                        <p className="font-poppins text-xl text-[#999]">
                                            Achat(s)
                                        </p>
                                    </div>
                                    <div className="mx-2 h-[90px] w-px bg-[#e0e0e0]" aria-hidden />
                                    <div className="flex flex-col items-center px-3 py-2.5">
                                        <p className="font-poppins text-[32px] font-semibold text-black">
                                            {account.tokens_count}
                                        </p>
                                        <p className="font-poppins text-xl text-[#999]">
                                            Jeton(s)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <nav className="mt-2 overflow-hidden rounded-xl">
                                <AccountDrawerMenuItem
                                    icon={Package}
                                    label="Mes commandes"
                                    href={route('customer.orders.index')}
                                    onClick={closeAccount}
                                />
                                <AccountDrawerMenuItem
                                    icon={Gift}
                                    label="Mes coupons"
                                    onClick={() => handlePlaceholder('Mes coupons')}
                                />
                                <AccountDrawerMenuItem
                                    icon={MapPin}
                                    label="Carnet d'adresses"
                                    onClick={() => handlePlaceholder("Carnet d'adresses")}
                                />
                                <AccountDrawerMenuItem
                                    icon={Settings}
                                    label="Informations personnelles"
                                    href={route('profile.edit')}
                                    onClick={closeAccount}
                                />
                                <AccountDrawerMenuItem
                                    icon={Headphones}
                                    label="Aides & Contact"
                                    href="mailto:kambmusene@gmail.com"
                                    onClick={closeAccount}
                                />
                                <AccountDrawerMenuItem
                                    icon={LogOut}
                                    label="Déconnexion"
                                    href={route('logout')}
                                    method="post"
                                    onClick={closeAccount}
                                />
                            </nav>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <p className="font-poppins text-xl text-[#737373]">
                                Impossible d&apos;afficher votre compte.
                            </p>
                            <Button
                                type="button"
                                variant="link"
                                className="font-poppins mt-4 text-lg font-semibold text-[#0059DD]"
                                onClick={() => router.visit(route('login'))}
                            >
                                Se connecter
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
