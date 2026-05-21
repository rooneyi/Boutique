import { SF_CARD, SF_SECTION_SUBTITLE, SF_SECTION_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AdminCardProps = {
    className?: string;
    children: React.ReactNode;
};

export function AdminCard({ className, children }: AdminCardProps) {
    return (
        <article
            className={cn(SF_CARD, 'border-neutral-100 shadow-sm hover:shadow-sm', 'p-6 text-black md:p-8', className)}
        >
            {children}
        </article>
    );
}

export function AdminCardTitle({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <h3 className={cn(SF_SECTION_TITLE, 'text-2xl md:text-[36px]', className)}>{children}</h3>;
}

export function AdminCardDescription({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <p className={cn(SF_SECTION_SUBTITLE, 'mt-1', className)}>{children}</p>;
}

export function AdminCardHeader({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <header className={cn('mb-6 space-y-1 border-b border-neutral-100 pb-4', className)}>{children}</header>;
}

export function AdminCardContent({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return <div className={cn(className)}>{children}</div>;
}
