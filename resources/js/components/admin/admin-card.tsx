import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ADMIN_CARD } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type AdminCardProps = React.ComponentProps<typeof Card>;

export function AdminCard({ className, ...props }: AdminCardProps) {
    return (
        <Card
            className={cn(
                ADMIN_CARD,
                'gap-0 py-0 shadow-sm ring-0',
                '[&_[data-slot=card-header]]:border-b [&_[data-slot=card-header]]:border-neutral-100 [&_[data-slot=card-header]]:px-6 [&_[data-slot=card-header]]:pt-6 [&_[data-slot=card-header]]:pb-4',
                '[&_[data-slot=card-content]]:px-6 [&_[data-slot=card-content]]:py-6',
                '[&_[data-slot=card-title]]:font-poppins [&_[data-slot=card-title]]:text-base [&_[data-slot=card-title]]:font-semibold [&_[data-slot=card-title]]:text-black',
                className,
            )}
            {...props}
        />
    );
}

export { CardHeader as AdminCardHeader, CardContent as AdminCardContent, CardDescription as AdminCardDescription, CardTitle as AdminCardTitle };
