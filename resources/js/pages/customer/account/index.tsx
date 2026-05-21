import { Head, usePage } from '@inertiajs/react';
import { FlashToaster } from '@/components/flash-toaster';
import { AccountMenuNav } from '@/components/storefront/account/account-menu-nav';
import { AccountProfileSection } from '@/components/storefront/account/account-profile-section';
import type { AccountPreview } from '@/components/storefront/account/account-types';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    account: AccountPreview;
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerAccountIndex() {
    const { auth, canRegister, account } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Mon compte · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <h1
                            className={cn(
                                SF_PAGE_TITLE,
                                'pt-6 pb-6 text-center sm:pt-8 sm:pb-8 lg:text-left',
                            )}
                        >
                            Mon compte
                        </h1>

                        <div className="mx-auto max-w-[751px] px-4 pb-16 sm:px-[18px]">
                            <AccountProfileSection account={account} compact={false} />
                            <div className="mt-4">
                                <AccountMenuNav />
                            </div>
                        </div>
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
