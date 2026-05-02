import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Truck, RotateCcw } from 'lucide-react';
import { useState } from 'react';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    original_price?: number;
    stock: number;
    category: string;
    image_path?: string;
    rating?: number;
    reviews_count?: number;
    colors?: string[];
    sizes?: string[];
    vendor: {
        id: number;
        shop_name: string;
    };
};

type Props = {
    product: Product;
    category_name?: string;
};

export default function ProductDetail() {
    const { product, category_name } = usePage<Props>().props;
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    const colors = product.colors || ['black', 'green', 'orange', 'blue'];
    const sizes = product.sizes || ['XS', 'S', 'M', 'L', 'XL'];
    
    const discount = product.original_price 
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0;

    const colorMap: Record<string, string> = {
        black: 'bg-black',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        blue: 'bg-blue-500',
        red: 'bg-red-500',
        white: 'bg-white border border-gray-300',
    };

    return (
        <>
            <Head title={product.name} />

            <div className="min-h-screen bg-white">
                {/* Breadcrumb */}
                <div className="border-b px-6 py-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Link href={route('customer.products.index')} className="hover:text-gray-900">
                            All Products
                        </Link>
                        <span>›</span>
                        <Link href={route('customer.products.index')} className="hover:text-gray-900">
                            {category_name || 'Category'}
                        </Link>
                        <span>›</span>
                        <span className="text-gray-900 font-medium">{product.name}</span>
                    </div>
                </div>

                <div className="px-6 py-8">
                    <div className="grid gap-12 md:grid-cols-2">
                        {/* Image Gallery */}
                        <div className="space-y-4">
                            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                                {product.image_path ? (
                                    <img
                                        src={product.image_path}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ShoppingCart className="h-24 w-24 text-gray-300" />
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail images */}
                            <div className="grid grid-cols-4 gap-2">
                                {[...Array(4)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`aspect-square overflow-hidden rounded-lg border-2 ${
                                            i === selectedColor ? 'border-black' : 'border-gray-200'
                                        }`}
                                    >
                                        {product.image_path ? (
                                            <img
                                                src={product.image_path}
                                                alt={`${product.name} view ${i + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full bg-gray-100">
                                                <span className="text-xs text-gray-400">{i + 1}</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span className="font-semibold">{product.rating || 4.3}</span>
                                    </div>
                                    <span className="text-gray-500">{product.reviews_count || 210} Reviews</span>
                                </div>

                                <h1 className="text-4xl font-bold">{product.name}</h1>
                                <p className="text-gray-600">{product.description}</p>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl font-bold">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {product.original_price && (
                                        <>
                                            <span className="text-lg text-gray-400 line-through">
                                                ${product.original_price.toFixed(2)}
                                            </span>
                                            <span className="text-lg font-semibold text-green-600">
                                                {discount}% Off
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Seller */}
                            <div className="text-sm">
                                <span className="text-gray-600">Sold by: </span>
                                <span className="font-medium">{product.vendor.shop_name}</span>
                            </div>

                            {/* Color Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold">Jacket Color:</label>
                                <div className="flex gap-3">
                                    {colors.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(idx)}
                                            className={`h-8 w-8 rounded-full border-2 transition-all ${
                                                selectedColor === idx ? 'border-black ring-2 ring-offset-2 ring-black' : 'border-gray-300'
                                            } ${colorMap[color] || 'bg-gray-400'}`}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold">Jacket Size:</label>
                                <div className="flex gap-2">
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border-2 rounded font-medium transition-all ${
                                                selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold">Quantity:</label>
                                <div className="flex items-center gap-3 w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 text-center border border-gray-300 rounded py-2"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-black hover:bg-gray-900 text-white font-semibold"
                                    asChild
                                >
                                    <button>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </button>
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-6 border-gray-300"
                                >
                                    <Heart className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="border-t pt-6" />

                            {/* Delivery Info */}
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <Truck className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Free Delivery</h3>
                                        <p className="text-sm text-gray-600">Enter your postal code for delivery availability</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <RotateCcw className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Return Delivery</h3>
                                        <p className="text-sm text-gray-600">
                                            Free 30 Days Delivery Returns.{' '}
                                            <button className="underline text-gray-900 hover:text-gray-700">Details</button>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Stock Status */}
                            {product.stock > 0 ? (
                                <Badge variant="outline" className="w-fit bg-green-50 border-green-200 text-green-700">
                                    In Stock ({product.stock} items)
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="w-fit bg-red-50 border-red-200 text-red-700">
                                    Out of Stock
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
