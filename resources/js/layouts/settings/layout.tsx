import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { ADMIN_PAGE_SECTION } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const navItems = [
    { title: 'Profil', href: edit.url() },
    { title: 'Sécurité', href: editSecurity.url() },
    { title: 'Apparence', href: editAppearance.url() },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className={ADMIN_PAGE_SECTION}>
            <AdminPageHeader
                title="Paramètres"
                description="Gérez votre profil et les préférences du compte."
            />

            <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <aside className="shrink-0 lg:w-44">
                    <nav
                        className="flex flex-row flex-wrap gap-1 lg:flex-col"
                        aria-label="Paramètres"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'rounded-lg px-3 py-2 font-poppins text-sm font-medium transition-colors',
                                    isCurrentOrParentUrl(item.href)
                                        ? 'bg-[#0059DD] text-white'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="min-w-0 max-w-2xl flex-1">
                    <section className="space-y-8">{children}</section>
                </div>
            </div>
        </div>
    );
}
