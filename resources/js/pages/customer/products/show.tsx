import { Head, usePage } from '@inertiajs/react';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ProductVariantPayload } from '@/components/storefront/product/product-purchase-panel';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeCurated, type CuratedProduct } from '@/components/storefront/home/home-curated';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import { ProductBreadcrumbs } from '@/components/storefront/product/product-breadcrumbs';
import { ProductGallery } from '@/components/storefront/product/product-gallery';
import { ProductInfoSection } from '@/components/storefront/product/product-info-section';
import { ProductPurchasePanel } from '@/components/storefront/product/product-purchase-panel';
import { ProductWearSection } from '@/components/storefront/product/product-wear-section';

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    image_path?: string | null;
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
    variants: ProductVariantPayload[];
    vendor: {
        id: number;
        shop_name: string;
    };
};

type ReviewRow = {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    author: string;
};

type UserReview = {
    rating: number;
    comment: string | null;
    updated_at: string;
} | null;

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    product: Product;
    category_name?: string;
    reviews: ReviewRow[];
    user_review: UserReview;
    can_review: boolean;
    canRegister: boolean;
    curatedProducts: CuratedProduct[];
    auth?: { user?: AuthUser | null };
};

export default function ProductDetail() {
    const {
        auth,
        canRegister,
        product,
        reviews,
        user_review,
        can_review,
        curatedProducts,
    } = usePage<PageProps>().props;

    const [galleryImage, setGalleryImage] = useState<string | null>(product.image_path ?? null);
    const purchaseColumnRef = useRef<HTMLDivElement>(null);
    const [galleryHeight, setGalleryHeight] = useState<number | undefined>(undefined);

    useLayoutEffect(() => {
        const node = purchaseColumnRef.current;
        if (!node) {
            return;
        }

        const syncHeight = () => {
            const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
            setGalleryHeight(isDesktop ? Math.round(node.getBoundingClientRect().height) : undefined);
        };

        syncHeight();

        const observer = new ResizeObserver(syncHeight);
        observer.observe(node);
        window.addEventListener('resize', syncHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', syncHeight);
        };
    }, [product.id, product.variants.length]);

    const images = useMemo(() => {
        const src = galleryImage ?? product.image_path;
        if (!src) {
            return [];
        }
        return Array.from({ length: 5 }, () => src);
    }, [galleryImage, product.image_path]);

    return (
        <>
            <Head title={`${product.name} · PCJ`} />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader
                    user={auth?.user}
                    canRegister={canRegister}
                    activeNav="collection"
                />

                <main>
                    <ProductBreadcrumbs productName={product.name} />

                    <section className="px-4 pb-12 sm:px-8 lg:px-14">
                        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 lg:flex-row lg:items-start lg:gap-7">
                            <div
                                className="flex min-h-0 min-w-0 flex-1 flex-col"
                                style={galleryHeight !== undefined ? { height: galleryHeight } : undefined}
                            >
                                <ProductGallery images={images} alt={product.name} />
                            </div>
                            <div ref={purchaseColumnRef} className="w-full shrink-0 lg:w-[542px]">
                                <ProductPurchasePanel
                                    product={product}
                                    onVariantImageChange={setGalleryImage}
                                />
                            </div>
                        </div>
                    </section>

                    <ProductInfoSection
                        productId={product.id}
                        description={product.description}
                        canReview={can_review}
                        userReview={user_review}
                        reviews={reviews}
                    />

                    <ProductWearSection />
                    <HomeCurated products={curatedProducts} />
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
