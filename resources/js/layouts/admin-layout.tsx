import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { FlashToaster } from '@/components/flash-toaster';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

type SharedPageProps = {
    auth?: {
        user?: {
            id: number;
            name?: string;
            email?: string;
            role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
        } | null;
    };
};

export default function AdminLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedPageProps>();
    const user = page.props.auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        /* h-screen + overflow-hidden → seul le main scroll, la sidebar reste fixe */
        <div className="admin-ui flex h-screen overflow-hidden bg-[#f1f5f9] font-poppins text-black antialiased scheme-light">
            <AdminSidebar
                path={page.url}
                user={user}
                mobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            {/* Zone de contenu — prend toute la largeur restante */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

                {/* Top bar — visible uniquement sur mobile (lg: sidebar déjà visible) */}
                <header className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
                    <button
                        type="button"
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Ouvrir le menu"
                    >
                        <Menu className="size-5" strokeWidth={1.75} />
                    </button>
                    <span className="font-poppins text-sm font-semibold text-slate-700">
                        PCJ Admin
                    </span>
                </header>

                {/* Contenu scrollable — overflow-y-auto ici, pas sur le parent */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        {children}
                    </div>
                </main>
            </div>

            <FlashToaster />
        </div>
    );
}
