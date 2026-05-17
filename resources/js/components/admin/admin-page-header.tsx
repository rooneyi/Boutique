import { ReactNode } from 'react';
import { ADMIN_MUTED, ADMIN_PAGE_TITLE } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function AdminPageHeader({ title, description, actions }: Props) {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
                <h1 className={ADMIN_PAGE_TITLE}>{title}</h1>
                {description ? (
                    <p className={cn(ADMIN_MUTED, 'mt-3 max-w-2xl')}>{description}</p>
                ) : null}
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </div>
    );
}
