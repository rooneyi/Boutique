import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ADMIN_CARD, ADMIN_H4, ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Props = {
    label: string;
    value: string | number;
    hint?: string;
    icon: LucideIcon;
};

export function AdminStatCard({ label, value, hint, icon: Icon }: Props) {
    return (
        <Card className={ADMIN_CARD}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h4 className={ADMIN_H4}>{label}</h4>
                <Icon className="size-5 text-[#747474]" strokeWidth={1.25} />
            </CardHeader>
            <CardContent>
                <p className="font-poppins text-3xl font-semibold text-black">{value}</p>
                {hint ? <p className={cn(ADMIN_MUTED, 'mt-1 text-sm')}>{hint}</p> : null}
            </CardContent>
        </Card>
    );
}
