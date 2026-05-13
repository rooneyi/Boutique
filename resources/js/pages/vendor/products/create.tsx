import { Head, Form } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { route } from '@/lib/route';
import { VENDOR_BTN_PRIMARY, VENDOR_CARD, VENDOR_H1, VENDOR_H3, VENDOR_MUTED } from '@/lib/vendor-ui-styles';
import { cn } from '@/lib/utils';

type Category = { id: number; name: string };

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number | null;
    image_path: string | null;
    status?: string;
};

type Props = {
    categories: Category[];
    product?: Product | null;
};

export default function CreateProduct({ categories, product }: Props) {
    const isEditing = !!product;
    const labelCn = 'font-poppins text-[20px] font-semibold text-[#747474]';
    const [categoryId, setCategoryId] = useState<string>(
        product?.category_id != null ? String(product.category_id) : ''
    );
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_path || null);
    const [lifecycleStatus, setLifecycleStatus] = useState<'IN_STOCK' | 'DISCONTINUED'>(() =>
        product?.status === 'DISCONTINUED' ? 'DISCONTINUED' : 'IN_STOCK'
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

    return (
        <>
            <Head title={isEditing ? 'Éditer Produit' : 'Créer Produit'} />

            <div className="mx-auto max-w-2xl space-y-8">
                <div>
                    <h1 className={VENDOR_H1}>{isEditing ? 'Éditer le produit' : 'Nouveau produit'}</h1>
                    <p className={cn(VENDOR_MUTED, 'mt-3')}>
                        {isEditing
                            ? 'Mettez à jour les informations de votre produit.'
                            : 'Remplissez les informations de votre produit.'}
                    </p>
                </div>

                <Card className={VENDOR_CARD}>
                    <CardHeader>
                        <h3 className={VENDOR_H3}>Informations</h3>
                        <CardDescription className={cn(VENDOR_MUTED, 'text-base')}>
                            Champs obligatoires marqués par le formulaire
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            method={isEditing ? 'put' : 'post'}
                            action={
                                isEditing
                                    ? route('vendor.products.update', product.id)
                                    : route('vendor.products.store')
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
                                            Prix (€)
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
                                        <Label htmlFor="stock" className={labelCn}>
                                            Quantité en stock
                                        </Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            placeholder="50"
                                            min="0"
                                            defaultValue={product?.stock}
                                            required
                                            disabled={processing}
                                            className="font-poppins"
                                        />
                                        <InputError message={errors.stock} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className={labelCn}>Catégorie</Label>
                                        <Select value={categoryId} onValueChange={setCategoryId}>
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
                                        <InputError message={errors.category_id} />
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
                                                <SelectItem value="DISCONTINUED">Produit terminé (retiré)</SelectItem>
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
                                        <Button type="submit" disabled={processing} className={cn(VENDOR_BTN_PRIMARY, 'disabled:pointer-events-none disabled:opacity-50')}>
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
