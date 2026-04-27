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

const CATEGORIES = ['Vêtements', 'Shoes', 'Accessoires', 'Autres'];

type Props = {
    product?: {
        id: number;
        name: string;
        description: string;
        price: number;
        quantity: number;
        category: string;
        image_path: string;
    };
};

export default function CreateProduct({ product }: Props) {
    const isEditing = !!product;
    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.image_path || null
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
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Nom */}
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

                                    {/* Description */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Décrivez votre produit..."
                                            defaultValue={product?.description}
                                            required
                                            disabled={processing}
                                            rows={4}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    {/* Prix */}
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

                                    {/* Quantité */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="quantity">
                                            Quantité en Stock
                                        </Label>
                                        <Input
                                            id="quantity"
                                            name="quantity"
                                            type="number"
                                            placeholder="50"
                                            min="0"
                                            defaultValue={product?.quantity}
                                            required
                                            disabled={processing}
                                        />
                                        <InputError message={errors.quantity} />
                                    </div>

                                    {/* Catégorie */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="category">Catégorie</Label>
                                        <Select
                                            name="category"
                                            defaultValue={product?.category || ''}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner une catégorie" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CATEGORIES.map((cat) => (
                                                    <SelectItem key={cat} value={cat}>
                                                        {cat}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category} />
                                    </div>

                                    {/* Image */}
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

                                    {/* Boutons */}
                                    <div className="flex gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
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
