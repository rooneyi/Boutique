export type FavoriteProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    image_path: string | null;
    vendor: { shop_name: string };
    rating_avg: number | null;
    reviews_count: number;
    is_favorite: boolean;
};

export type FavoritesPreview = {
    products: FavoriteProduct[];
    count: number;
};
