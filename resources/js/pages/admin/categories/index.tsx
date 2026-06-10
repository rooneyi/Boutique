import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AdminDataTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    ADMIN_TABLE_CELL,
    ADMIN_TABLE_HEAD,
    ADMIN_TABLE_HEADER_ROW,
    ADMIN_TABLE_ROW,
} from '@/components/admin/admin-table';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { AdminPageHeader } from '@/components/admin/admin-page-header';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_PRIMARY,
    ADMIN_H3,
    ADMIN_MUTED,
    ADMIN_PAGE_SECTION,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type CategoryRow = {
    id: number;
    name: string;
    products_count: number;
};

type Props = {
    categories: CategoryRow[];
};

export default function AdminCategories({ categories }: Props) {
    const { errors } = usePage<{ errors?: { category?: string } }>().props;
    const [editingId, setEditingId] = useState<number | null>(null);
    const labelCn = 'font-poppins text-[20px] font-semibold text-[#747474]';

    return (
        <>
            <Head title="Catégories · Admin" />

            <div className={ADMIN_PAGE_SECTION}>
                <AdminPageHeader
                    title="Catégories"
                    description="Créez les catégories du catalogue. Chaque produit doit être rattaché à une catégorie."
                />

                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Nouvelle catégorie</h3>
                        <AdminCardDescription className={ADMIN_MUTED}>
                            Ex. Robes, Pantalons, Accessoires…
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        <Form
                            action={route('admin.categories.store')}
                            method="post"
                            className="flex flex-col gap-4 sm:flex-row sm:items-end"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid flex-1 gap-2">
                                        <Label htmlFor="name" className={labelCn}>
                                            Nom
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Robes"
                                            required
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                        <InputError message={errors.name} />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className={cn(ADMIN_BTN_PRIMARY, 'shrink-0')}
                                    >
                                        {processing ? (
                                            <Spinner className="size-4" />
                                        ) : (
                                            <>
                                                <Plus className="size-5" />
                                                Ajouter
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </AdminCardContent>
                </AdminCard>

                <AdminCard className="mt-8">
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>Liste</h3>
                        <AdminCardDescription>
                            {categories.length} catégorie(s)
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent>
                        <InputError message={errors?.category} className="mb-4" />
                        <AdminDataTable>
                            <TableHeader>
                                <TableRow className={ADMIN_TABLE_HEADER_ROW}>
                                    <TableHead className={ADMIN_TABLE_HEAD}>Nom</TableHead>
                                    <TableHead className={ADMIN_TABLE_HEAD}>Produits</TableHead>
                                    <TableHead className={ADMIN_TABLE_HEAD}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow className={ADMIN_TABLE_ROW}>
                                        <TableCell
                                            colSpan={3}
                                            className={cn(ADMIN_TABLE_CELL, 'text-center')}
                                        >
                                            Aucune catégorie. Ajoutez-en une pour créer des produits.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((cat) => (
                                        <TableRow key={cat.id} className={ADMIN_TABLE_ROW}>
                                            <TableCell className={ADMIN_TABLE_CELL}>
                                                {editingId === cat.id ? (
                                                    <Form
                                                        action={route('admin.categories.update', cat.id)}
                                                        method="put"
                                                        className="flex flex-wrap items-center gap-2"
                                                        onSuccess={() => setEditingId(null)}
                                                    >
                                                        {({ processing, errors }) => (
                                                            <>
                                                                <Input
                                                                    name="name"
                                                                    defaultValue={cat.name}
                                                                    required
                                                                    disabled={processing}
                                                                    className="max-w-xs font-poppins"
                                                                />
                                                                <Button
                                                                    type="submit"
                                                                    size="sm"
                                                                    disabled={processing}
                                                                    className="font-poppins"
                                                                >
                                                                    Enregistrer
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setEditingId(null)}
                                                                >
                                                                    Annuler
                                                                </Button>
                                                                <InputError message={errors.name} />
                                                            </>
                                                        )}
                                                    </Form>
                                                ) : (
                                                    cat.name
                                                )}
                                            </TableCell>
                                            <TableCell className={ADMIN_TABLE_CELL}>
                                                {cat.products_count}
                                            </TableCell>
                                            <TableCell className={ADMIN_TABLE_CELL}>
                                                <div className="flex flex-wrap gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="font-poppins"
                                                        onClick={() =>
                                                            setEditingId(
                                                                editingId === cat.id ? null : cat.id,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="mr-1 size-4" />
                                                        Modifier
                                                    </Button>
                                                    <Form
                                                        action={route('admin.categories.destroy', cat.id)}
                                                        method="delete"
                                                        onBefore={() =>
                                                            confirm(
                                                                `Supprimer la catégorie « ${cat.name} » ?`,
                                                            )
                                                        }
                                                    >
                                                        {({ processing }) => (
                                                            <Button
                                                                type="submit"
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={
                                                                    processing ||
                                                                    cat.products_count > 0
                                                                }
                                                                className="font-poppins text-red-600 hover:text-red-700"
                                                                title={
                                                                    cat.products_count > 0
                                                                        ? 'Retirez d’abord les produits de cette catégorie'
                                                                        : undefined
                                                                }
                                                            >
                                                                <Trash2 className="mr-1 size-4" />
                                                                Supprimer
                                                            </Button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </AdminDataTable>

                        <p className={cn(ADMIN_MUTED, 'mt-4 text-sm')}>
                            <Link
                                href={route('admin.products.create')}
                                className="text-[#0059DD] underline-offset-2 hover:underline"
                            >
                                Créer un produit
                            </Link>{' '}
                            une fois vos catégories prêtes.
                        </p>
                    </AdminCardContent>
                </AdminCard>
            </div>
        </>
    );
}
