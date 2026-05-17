import { ReactNode } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import { AdminHeader } from '@/components/admin/admin-header';
import { ADMIN_PAGE_BG, ADMIN_SHELL_MAX } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div
            className={cn(
                'admin-ui flex min-h-screen flex-col font-poppins text-black antialiased scheme-light',
                ADMIN_PAGE_BG,
            )}
        >
            <AdminHeader />
            <main className={cn(ADMIN_SHELL_MAX, 'w-full flex-1 px-4 py-10 sm:px-8 lg:px-[100px]')}>
                {children}
            </main>
            <FlashToaster />
        </div>
    );
}
