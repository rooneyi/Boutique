import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ADMIN_CARD, ADMIN_H4, ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    icon: LucideIcon;
    accent?: boolean;
};

export function AdminStatCard({ label, value, hint, icon: Icon, accent }: Props) {
    return (
        <Card className={cn(ADMIN_CARD, 'transition-shadow hover:shadow-md')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h4 className={ADMIN_H4}>{label}</h4>
                <span className="flex size-10 items-center justify-center rounded-full bg-[#0059DD]/10">
                    <Icon className="size-5 text-[#0059DD]" strokeWidth={1.25} />
                </span>
            </CardHeader>
            <CardContent>
                <p
                    className={cn(
                        'font-poppins text-3xl font-semibold tracking-tight',
                        accent ? 'text-[#0059DD]' : 'text-black',
                    )}
                >
                    {value}
                </p>
                {hint ? <p className={cn(ADMIN_MUTED, 'mt-2 text-sm')}>{hint}</p> : null}
            </CardContent>
        </Card>
    );
}
