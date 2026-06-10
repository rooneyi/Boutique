import { Head } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { ADMIN_H3 } from '@/lib/admin-ui-styles';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Apparence" />
            <h1 className="sr-only">Paramètres d&apos;apparence</h1>

            <AdminCard>
                <AdminCardHeader>
                    <h3 className={ADMIN_H3}>Apparence</h3>
                    <AdminCardDescription>
                        Personnalisez l&apos;affichage de l&apos;interface.
                    </AdminCardDescription>
                </AdminCardHeader>
                <AdminCardContent>
                    <AppearanceTabs />
                </AdminCardContent>
            </AdminCard>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [{ title: 'Apparence', href: editAppearance() }],
};
