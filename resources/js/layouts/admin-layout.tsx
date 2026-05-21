import { usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { ADMIN_SHELL_MAX } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type SharedPageProps = {
    auth?: {
        user?: {
            id: number;
            role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
        } | null;
    };
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedPageProps>();
    const user = page.props.auth?.user;

    return (
        <div className="admin-ui flex min-h-screen flex-col bg-[#f8f7f9] font-poppins text-black antialiased scheme-light">
            <HomeHeader chrome="admin" adminPath={page.url} user={user} />
            <main
                className={cn(
                    ADMIN_SHELL_MAX,
                    'w-full flex-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-[100px] lg:py-10',
                )}
            >
                {children}
            </main>
            <HomeFooter />
            <FlashToaster />
        </div>
    );
}
