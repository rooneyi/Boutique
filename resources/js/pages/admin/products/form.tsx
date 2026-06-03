import { Head, Form, Link } from '@inertiajs/react';
import { ProductColorPicker } from '@/components/admin/product-color-picker';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { route } from '@/lib/route';
import {
    ADMIN_BTN_PRIMARY,
    ADMIN_CARD,
    ADMIN_H3,
    ADMIN_MUTED,
    ADMIN_PAGE_TITLE,
} from '@/lib/admin-ui-styles';
import { cn } from '@/lib/utils';

type Category = { id: number; name: string };

type VariantPayload = {
    id?: number;
    color: string;
    color_hex: string | null;
    size: string;
    sku: string | null;
    stock: number;
};

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category_id: number | null;
    image_path: string | null;
    status?: string;
    variants?: VariantPayload[];
};

type VariantRow = {
    color: string;
    color_hex: string;
    size: string;
    sku: string;
    stock: string;
};

type Props = {
    categories: Category[];
    sizes: string[];
    product?: Product | null;
};

function emptyVariantRow(size = 'M'): VariantRow {
    return { color: 'Noir', color_hex: '#000000', size, sku: '', stock: '0' };
}

function rowsFromProduct(variants: VariantPayload[] | undefined, defaultSize: string): VariantRow[] {
    if (!variants?.length) {
        return [emptyVariantRow(defaultSize)];
    }
    return variants.map((v) => ({
        color: v.color,
        color_hex: v.color_hex ?? '#000000',
        size: v.size,
        sku: v.sku ?? '',
        stock: String(v.stock),
    }));
}

export default function CreateProduct({ categories, sizes, product }: Props) {
    const isEditing = !!product;
    const defaultSize = sizes[2] ?? 'M';
    const labelCn = 'font-poppins text-[20px] font-semibold text-[#747474]';
    const [categoryId, setCategoryId] = useState<string>(
        product?.category_id != null ? String(product.category_id) : '',
    );
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_path || null);
    const [lifecycleStatus, setLifecycleStatus] = useState<'IN_STOCK' | 'DISCONTINUED'>(() =>
        product?.status === 'DISCONTINUED' ? 'DISCONTINUED' : 'IN_STOCK',
    );
    const [variantRows, setVariantRows] = useState<VariantRow[]>(() =>
        rowsFromProduct(product?.variants, defaultSize),
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImagePreview(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    function updateRow(index: number, patch: Partial<VariantRow>) {
        setVariantRows((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
    }

    function addRow() {
        setVariantRows((rows) => [...rows, emptyVariantRow(defaultSize)]);
    }

    function removeRow(index: number) {
        setVariantRows((rows) => (rows.length <= 1 ? rows : rows.filter((_, i) => i !== index)));
    }

    return (
        <>
            <Head title={isEditing ? 'Éditer Produit' : 'Créer Produit'} />

            <div className="mx-auto max-w-3xl space-y-8">
                <div>
                    <h1 className={ADMIN_PAGE_TITLE}>{isEditing ? 'Éditer le produit' : 'Nouveau produit'}</h1>
                    <p className={cn(ADMIN_MUTED, 'mt-3')}>
                        {isEditing
                            ? 'Mettez à jour les informations et les articles (couleur / taille).'
                            : 'Renseignez la catégorie, le prix et au moins un article en stock.'}
                    </p>
                </div>

                <Card className={ADMIN_CARD}>
                    <CardHeader>
                        <h3 className={ADMIN_H3}>Informations</h3>
                        <CardDescription className={cn(ADMIN_MUTED, 'text-base')}>
                            Catégorie obligatoire · au moins un article
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            method={isEditing ? 'put' : 'post'}
                            action={
                                isEditing
                                    ? route('admin.products.update', product.id)
                                    : route('admin.products.store')
                            }
                            encType="multipart/form-data"
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input type="hidden" name="category_id" value={categoryId || ''} />
                                    <input type="hidden" name="status" value={lifecycleStatus} />

                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className={labelCn}>
                                            Nom du produit
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="T-shirt Coton Premium"
                                            defaultValue={product?.name}
                                            required
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description" className={labelCn}>
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Décrivez votre produit..."
                                            defaultValue={product?.description ?? ''}
                                            disabled={processing}
                                            rows={4}
                                            className="font-poppins"
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price" className={labelCn}>
                                            Prix ($)
                                        </Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="19.99"
                                            step="0.01"
                                            min="0"
                                            defaultValue={product?.price}
                                            required
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className={labelCn}>Catégorie</Label>
                                        {categories.length === 0 ? (
                                            <p className="font-poppins text-sm text-[#747474]">
                                                Aucune catégorie.{' '}
                                                <Link
                                                    href={route('admin.categories.index')}
                                                    className="text-[#0059DD] underline-offset-2 hover:underline"
                                                >
                                                    Créer des catégories
                                                </Link>{' '}
                                                avant d’ajouter un produit.
                                            </p>
                                        ) : (
                                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                                <SelectTrigger className="font-poppins">
                                                    <SelectValue placeholder="Sélectionner une catégorie" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                        <InputError message={errors.category_id} />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <Label className={labelCn}>Articles en stock</Label>
                                                <p className={cn(ADMIN_MUTED, 'mt-1 text-sm')}>
                                                    Une ligne = couleur + taille (réf. SKU optionnelle)
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="font-poppins"
                                                onClick={addRow}
                                                disabled={processing}
                                            >
                                                <Plus className="mr-1 size-4" />
                                                Ajouter une ligne
                                            </Button>
                                        </div>

                                        <InputError message={errors.variants as string} />

                                        <div className="space-y-3">
                                            {variantRows.map((row, index) => (
                                                <div
                                                    key={index}
                                                    className="grid gap-3 rounded-lg border border-neutral-200 p-4 sm:grid-cols-2 lg:grid-cols-6"
                                                >
                                                    <input
                                                        type="hidden"
                                                        name={`variants[${index}][color]`}
                                                        value={row.color}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`variants[${index}][color_hex]`}
                                                        value={row.color_hex}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`variants[${index}][size]`}
                                                        value={row.size}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`variants[${index}][sku]`}
                                                        value={row.sku}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name={`variants[${index}][stock]`}
                                                        value={row.stock}
                                                    />

                                                    <ProductColorPicker
                                                        color={row.color}
                                                        colorHex={row.color_hex}
                                                        disabled={processing}
                                                        onChange={(patch) => updateRow(index, patch)}
                                                    />

                                                    <div className="grid gap-1">
                                                        <Label className="text-sm font-medium text-[#747474]">
                                                            Taille
                                                        </Label>
                                                        <Select
                                                            value={row.size}
                                                            onValueChange={(v) => updateRow(index, { size: v })}
                                                        >
                                                            <SelectTrigger className="font-poppins">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {sizes.map((s) => (
                                                                    <SelectItem key={s} value={s}>
                                                                        {s}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="grid gap-1 sm:col-span-2">
                                                        <Label className="text-sm font-medium text-[#747474]">
                                                            Réf. article (SKU)
                                                        </Label>
                                                        <Input
                                                            value={row.sku}
                                                            onChange={(e) =>
                                                                updateRow(index, { sku: e.target.value })
                                                            }
                                                            placeholder="PCJ-ROBE-NOIR-M"
                                                            disabled={processing}
                                                            className="font-poppins"
                                                        />
                                                    </div>

                                                    <div className="grid gap-1">
                                                        <Label className="text-sm font-medium text-[#747474]">
                                                            Stock
                                                        </Label>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={row.stock}
                                                            onChange={(e) =>
                                                                updateRow(index, { stock: e.target.value })
                                                            }
                                                            required
                                                            disabled={processing}
                                                            className="font-poppins"
                                                        />
                                                    </div>

                                                    <div className="flex items-end justify-end sm:col-span-2 lg:col-span-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-[#747474] hover:text-red-600"
                                                            onClick={() => removeRow(index)}
                                                            disabled={processing || variantRows.length <= 1}
                                                            aria-label="Supprimer la ligne"
                                                        >
                                                            <Trash2 className="size-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className={labelCn}>Visibilité catalogue</Label>
                                        <Select
                                            value={lifecycleStatus}
                                            onValueChange={(v) =>
                                                setLifecycleStatus(v as 'IN_STOCK' | 'DISCONTINUED')
                                            }
                                        >
                                            <SelectTrigger className="font-poppins">
                                                <SelectValue placeholder="Statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="IN_STOCK">
                                                    En vente (statut auto selon le stock)
                                                </SelectItem>
                                                <SelectItem value="DISCONTINUED">
                                                    Produit terminé (retiré)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="image" className={labelCn}>
                                            Image du produit
                                        </Label>
                                        <Input
                                            id="image"
                                            name="image"
                                            type="file"
                                            accept="image/*"
                                            disabled={processing}
                                            onChange={handleImageChange}
                                        />
                                        {imagePreview && (
                                            <img
                                                src={imagePreview}
                                                alt="Aperçu"
                                                className="mt-2 max-h-64 rounded-sm object-cover"
                                            />
                                        )}
                                        <InputError message={errors.image} />
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Button
                                            type="submit"
                                            disabled={
                                                processing || !categoryId || categories.length === 0
                                            }
                                            className={cn(
                                                ADMIN_BTN_PRIMARY,
                                                'disabled:pointer-events-none disabled:opacity-50',
                                            )}
                                        >
                                            {processing ? (
                                                <>
                                                    <Spinner className="h-4 w-4" />
                                                    {isEditing ? 'Mise à jour…' : 'Création…'}
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="h-5 w-5" />
                                                    {isEditing ? 'Mettre à jour' : 'Créer'}
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="font-poppins border-neutral-300 text-base font-normal text-black hover:bg-neutral-50"
                                            onClick={() => window.history.back()}
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
