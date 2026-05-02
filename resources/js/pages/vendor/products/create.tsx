import { Head, Form } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useState } from 'react';

type Category = { id: number; name: string };

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category_id: number | null;
    image_path: string | null;
};

type Props = {
    categories: Category[];
    product?: Product | null;
};

export default function CreateProduct({ categories, product }: Props) {
    const isEditing = !!product;
    const [categoryId, setCategoryId] = useState<string>(
        product?.category_id != null ? String(product.category_id) : ''
    );
    const [imagePreview, setImagePreview] = useState<string | null>(product?.image_path || null);

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

            <div className="max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {isEditing ? 'Éditer le Produit' : 'Créer un Nouveau Produit'}
                        </CardTitle>
                        <CardDescription>
                            {isEditing
                                ? 'Mettez à jour les informations de votre produit'
                                : 'Remplissez les informations de votre produit'}
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

                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nom du Produit</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="T-shirt Coton Premium"
                                            defaultValue={product?.name}
                                            required
                                            disabled={processing}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Décrivez votre produit..."
                                            defaultValue={product?.description ?? ''}
                                            disabled={processing}
                                            rows={4}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="price">Prix (€)</Label>
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
                                        />
                                        <InputError message={errors.price} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="stock">Quantité en stock</Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            placeholder="50"
                                            min="0"
                                            defaultValue={product?.stock}
                                            required
                                            disabled={processing}
                                        />
                                        <InputError message={errors.stock} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label>Catégorie</Label>
                                        <Select value={categoryId} onValueChange={setCategoryId}>
                                            <SelectTrigger>
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
                                        <Label htmlFor="image">Image du Produit</Label>
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
                                                className="mt-2 max-h-64 rounded-lg object-cover"
                                            />
                                        )}
                                        <InputError message={errors.image} />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={processing}>
                                            {processing ? (
                                                <>
                                                    <Spinner className="mr-2 h-4 w-4" />
                                                    {isEditing ? 'Mise à jour...' : 'Création...'}
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    {isEditing ? 'Mettre à jour' : 'Créer'}
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
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
