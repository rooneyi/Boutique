import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
    ADMIN_TABLE_HEADER_ROW,
    ADMIN_TABLE_INNER,
    ADMIN_TABLE_ROW,
    ADMIN_TABLE_WRAPPER,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type ShellProps = {
    children: React.ReactNode;
    className?: string;
};

/** Conteneur + styles tableau admin (bordures et survol atténués). */
export function AdminDataTable({ children, className }: ShellProps) {
    return (
        <div className={cn(ADMIN_TABLE_WRAPPER, className)}>
            <Table className={ADMIN_TABLE_INNER}>{children}</Table>
        </div>
    );
}

export {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
    ADMIN_TABLE_HEADER_ROW,
    ADMIN_TABLE_ROW,
};
