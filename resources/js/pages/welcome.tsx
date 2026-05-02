import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, ArrowRight, Search, User, Menu } from 'lucide-react';
import { useState } from 'react';

type AuthUser = {
    id: number;
    name: string;
    email: string;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    auth?: {
        user?: AuthUser | null;
    };
    errors?: Record<string, string>;
    flash?: {
        error?: string;
        success?: string;
    };
};

const FEATURED_PRODUCTS = [
    {
        id: 1,
        name: 'Classic Leather Jacket',
        price: 479.20,
        original_price: 599.00,
        image: '🧥',
        rating: 4.3,
        reviews: 210,
        discount: 20,
    },
    {
        id: 2,
        name: 'Premium Leather Shoes',
        price: 199.99,
        original_price: 299.99,
        image: '👞',
        rating: 4.8,
        reviews: 156,
        discount: 33,
    },
    {
        id: 3,
        name: 'Wool Winter Coat',
        price: 349.99,
        original_price: 449.99,
        image: '🧥',
        rating: 4.5,
        reviews: 89,
        discount: 22,
    },
    {
        id: 4,
        name: 'Silk Evening Dress',
        price: 259.99,
        original_price: 349.99,
        image: '👗',
        rating: 4.7,
        reviews: 142,
        discount: 26,
    },
];

const CATEGORIES = [
    { name: 'Menswear', icon: '👔', count: 234 },
    { name: 'Womenswear', icon: '👗', count: 456 },
    { name: 'Accessories', icon: '👜', count: 189 },
    { name: 'Footwear', icon: '👞', count: 312 },
    { name: 'Outerwear', icon: '🧥', count: 267 },
    { name: 'Activewear', icon: '🏃', count: 178 },
];

export default function Welcome() {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth?.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const dashboardHref = user?.role === 'ADMIN'
        ? '/admin/dashboard'
        : user?.role === 'VENDOR'
          ? '/vendor/dashboard'
          : '/customer/products';

    return (
        <>
            <Head title="Boutique - Modern Fashion & Accessories" />

            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="text-2xl font-bold">Boutique</div>
                            </Link>

                            {/* Search Bar - Hidden on mobile */}
                            <div className="hidden md:block flex-1 max-w-md mx-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                    />
                                    <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Right Actions */}
                            <div className="flex items-center gap-6">
                                <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
                                    <Heart className="h-6 w-6" />
                                </button>
                                <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg">
                                    <ShoppingCart className="h-6 w-6" />
                                </button>

                                {user ? (
                                    <Link href={dashboardHref}>
                                        <Button size="sm">Dashboard</Button>
                                    </Link>
                                ) : (
                                    <Link href="/auth/login">
                                        <Button size="sm">Sign In</Button>
                                    </Link>
                                )}

                                <button
                                    className="md:hidden p-2"
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                >
                                    <Menu className="h-6 w-6" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile Search */}
                        <div className="md:hidden pb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 mt-4 rounded-lg">
                        {flash.error}
                    </div>
                )}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 mx-4 mt-4 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <p className="text-blue-400 font-semibold uppercase tracking-widest">Welcome to Boutique</p>
                                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                                        Discover Timeless Fashion
                                    </h1>
                                    <p className="text-xl text-gray-300">
                                        Curated collections from premium sellers worldwide. Find your style today.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Link href="/auth/customer/register">
                                        <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold">
                                            Shop Now
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                    <Link href="#categories">
                                        <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold">
                                            Browse Categories
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex gap-8 pt-4 text-sm">
                                    <div>
                                        <p className="font-bold text-2xl">50K+</p>
                                        <p className="text-gray-400">Products</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-2xl">10K+</p>
                                        <p className="text-gray-400">Sellers</p>
                                    </div>
                                    <div>
                                        <p className="font-bold text-2xl">100K+</p>
                                        <p className="text-gray-400">Happy Customers</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Image */}
                            <div className="hidden md:flex items-center justify-center text-9xl">
                                🧥
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="categories" className="py-16 md:py-24 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
                            <p className="text-gray-600 text-lg">Explore our diverse collection of fashion items</p>
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category.name}
                                    className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300 text-center"
                                >
                                    <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                                        {category.icon}
                                    </div>
                                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                                    <p className="text-sm text-gray-500">{category.count} items</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products Section */}
                <section className="py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured Products</h2>
                                <p className="text-gray-600">Hand-picked selections from our best sellers</p>
                            </div>
                            <Link href="/auth/customer/register">
                                <Button variant="outline" className="gap-2">
                                    View All
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {FEATURED_PRODUCTS.map((product) => (
                                <div
                                    key={product.id}
                                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                >
                                    {/* Product Image */}
                                    <div className="aspect-square bg-gray-100 flex items-center justify-center text-6xl group-hover:bg-gray-200 transition-colors">
                                        {product.image}
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold text-sm">{product.rating}</span>
                                            </div>
                                            <span className="text-xs text-gray-500">({product.reviews})</span>
                                        </div>

                                        {/* Name */}
                                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                                            {product.name}
                                        </h3>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-lg font-bold">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="text-sm text-gray-500 line-through">
                                                ${product.original_price.toFixed(2)}
                                            </span>
                                            <span className="ml-auto text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                                                {product.discount}% OFF
                                            </span>
                                        </div>

                                        {/* Add to Cart */}
                                        <Button className="w-full bg-black hover:bg-gray-900 text-white gap-2">
                                            <ShoppingCart className="h-4 w-4" />
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="bg-gray-900 text-white py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Subscribe to our newsletter for exclusive deals and new arrivals.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                Subscribe
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-50 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid md:grid-cols-4 gap-8 mb-12">
                            <div>
                                <h3 className="font-bold text-lg mb-4">About Boutique</h3>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li><a href="#" className="hover:text-black">About Us</a></li>
                                    <li><a href="#" className="hover:text-black">Careers</a></li>
                                    <li><a href="#" className="hover:text-black">Blog</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">Customer Service</h3>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li><a href="#" className="hover:text-black">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-black">Returns</a></li>
                                    <li><a href="#" className="hover:text-black">Shipping Info</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">For Sellers</h3>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li><a href="/auth/vendor/register" className="hover:text-black">Become a Seller</a></li>
                                    <li><a href="#" className="hover:text-black">Seller Guide</a></li>
                                    <li><a href="#" className="hover:text-black">Resources</a></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg mb-4">Legal</h3>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                    <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-black">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-black">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
                            <p className="text-gray-600 text-sm">
                                © 2024 Boutique. All rights reserved.
                            </p>
                            <div className="flex gap-6 mt-4 md:mt-0">
                                <a href="#" className="text-gray-600 hover:text-black">Facebook</a>
                                <a href="#" className="text-gray-600 hover:text-black">Instagram</a>
                                <a href="#" className="text-gray-600 hover:text-black">Twitter</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
