import { Link } from '@inertiajs/react';
import { ADMIN_FILTER_PILL, ADMIN_FILTER_PILL_ACTIVE } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

export type AdminFilterTab = {
    label: string;
    href: string;
    active: boolean;
};

type Props = {
    tabs: AdminFilterTab[];
};

export function AdminFilterTabs({ tabs }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(tab.active ? ADMIN_FILTER_PILL_ACTIVE : ADMIN_FILTER_PILL)}
                >
                    {tab.label}
                </Link>
            ))}
        </div>
    );
}
