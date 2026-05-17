import { ReactNode } from 'react';
import { ADMIN_KICKER, ADMIN_PAGE_SUBTITLE, ADMIN_PAGE_TITLE } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    kicker?: string;
    actions?: ReactNode;
};

export function AdminPageHeader({
    title,
    description,
    kicker = 'Administration',
    actions,
}: Props) {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
                <p className={ADMIN_KICKER}>{kicker}</p>
                <h1 className={ADMIN_PAGE_TITLE}>{title}</h1>
                {description ? (
                    <p className={cn(ADMIN_PAGE_SUBTITLE, 'max-w-2xl')}>{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
    );
}
