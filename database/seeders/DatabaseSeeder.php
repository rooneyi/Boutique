<?php

namespace Database\Seeders;

use App\Data\OrderData;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use App\Models\Vendor;
use App\Services\OrderService;
use App\Services\ProductVariantService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Date::now();

        $admin = User::updateOrCreate(
            ['email' => 'admin@boutique.test'],
            [
                'name' => 'Administrateur',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'email_verified_at' => $now,
            ]
        );

        $store = Vendor::firstOrCreate(
            ['user_id' => $admin->id],
            ['shop_name' => 'PCJ'],
        );

        $categories = collect(['Pack', 'Pull', 'T-shirt', 'Casquette'])
            ->mapWithKeys(fn (string $name) => [$name => Category::firstOrCreate(['name' => $name])]);

        OrderItem::query()->delete();
        Order::query()->delete();
        DB::table('product_favorites')->delete();
        ProductReview::query()->delete();
        Product::query()->delete();

        $customerUsers = [
            ['email' => 'sophie@client.test', 'name' => 'Sophie Dupont'],
            ['email' => 'marc@client.test', 'name' => 'Marc Lefèvre'],
            ['email' => 'lea@client.test', 'name' => 'Léa Garnier'],
        ];

        $customers = collect($customerUsers)->map(function (array $row) use ($now) {
            $user = User::updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => bcrypt('password'),
                    'role' => 'CUSTOMER',
                    'email_verified_at' => $now,
                ]
            );

            return Customer::firstOrCreate(['user_id' => $user->id]);
        });

        $pack = $categories['Pack']->id;
        $pull = $categories['Pull']->id;
        $tshirt = $categories['T-shirt']->id;
        $casquette = $categories['Casquette']->id;

        // Catalogue réel PCJ — même nom = variants couleur (filtre couleur + image par couleur)
        $catalog = [
            [
                'name' => 'T-shirt PCJ Officiel',
                'description' => 'T-shirt officiel PCJ, grand logo circulaire. Disponible en plusieurs couleurs.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-3.jpeg',
                'variants' => [
                    ...self::colorSizes('Beige', '#C4A882', 'PCJ-TEE-OFF-BEIGE', [15, 25, 20, 12], 'media/tshirt/product-1.jpeg'),
                    ...self::colorSizes('Blanc', '#FFFFFF', 'PCJ-TEE-OFF-BLANC', [20, 32, 26, 16], 'media/tshirt/product-3.jpeg'),
                    ...self::colorSizes('Bleu', '#1E5AFF', 'PCJ-TEE-OFF-BLEU', [14, 24, 20, 12], 'media/tshirt/product-5.jpeg'),
                ],
            ],
            [
                'name' => 'T-shirt PCJ Blanc Minimal',
                'description' => 'T-shirt blanc essentiel, petit logo PCJ discret sur le cœur. Coupe moderne au quotidien.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-2.jpeg',
                'variants' => self::colorSizes('Blanc', '#FFFFFF', 'PCJ-TEE-MIN', [18, 30, 28, 14], 'media/tshirt/product-2.jpeg'),
            ],
            [
                'name' => 'T-shirt Posé Comme Jamais',
                'description' => 'T-shirt Posé Comme Jamais — message signature, plusieurs coloris.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-4.jpeg',
                'variants' => [
                    ...self::colorSizes('Jaune', '#F5C518', 'PCJ-TEE-PCJ-JAUNE', [12, 22, 18, 10], 'media/tshirt/product-4.jpeg'),
                    ...self::colorSizes('Blanc', '#FFFFFF', 'PCJ-TEE-PCJ-BLANC', [16, 28, 22, 14], 'media/tshirt/product-6.jpeg'),
                    ...self::colorSizes('Rose', '#F2C4C4', 'PCJ-TEE-PCJ-ROSE', [15, 26, 20, 12], 'media/tshirt/product-7.jpeg'),
                ],
            ],
            [
                'name' => 'Casquette PCJ Trucker',
                'description' => 'Casquette trucker verte, logo PCJ jaune brodé. Ajustable, mesh arrière.',
                'price' => 8.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-1.jpeg',
                'variants' => [
                    ['color' => 'Vert', 'color_hex' => '#3D5A3D', 'size' => 'TU', 'sku' => 'PCJ-CAP-VERT-TU', 'stock' => 40, 'image' => 'media/casquette/product-1.jpeg'],
                ],
            ],
            [
                'name' => 'Casquette PCJ Essentiel',
                'description' => 'Casquette trucker gris anthracite, logo PCJ doré. Basique ajustable pour tous les jours.',
                'price' => 5.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-2.jpeg',
                'variants' => [
                    ['color' => 'Gris', 'color_hex' => '#4A4A4A', 'size' => 'TU', 'sku' => 'PCJ-CAP-ESS-TU', 'stock' => 45, 'image' => 'media/casquette/product-2.jpeg'],
                ],
            ],
            [
                'name' => 'Casquette PCJ',
                'description' => 'Casquette trucker Posé Comme Jamais. Plusieurs coloris.',
                'price' => 5.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-3.jpeg',
                'variants' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'TU', 'sku' => 'PCJ-CAP-PCJ-BLANC-TU', 'stock' => 40, 'image' => 'media/casquette/product-3.jpeg'],
                    ['color' => 'Bleu', 'color_hex' => '#1A3DFF', 'size' => 'TU', 'sku' => 'PCJ-CAP-PCJ-BLEU-TU', 'stock' => 40, 'image' => 'media/casquette/product-4.jpeg'],
                ],
            ],
            [
                'name' => 'Pack Casquette & T-shirt',
                'description' => 'Ensemble PCJ : casquette Essentiel + t-shirt Posé Comme Jamais. Le duo complet à prix pack.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-8.jpeg',
                'variants' => self::colorSizes('Gris', '#B8B8B8', 'PCJ-PACK-GRIS', [10, 18, 15, 10], 'media/tshirt/product-8.jpeg'),
            ],
            [
                'name' => 'Pack Casquette & T-shirt PCJ',
                'description' => 'Duo PCJ : casquette blanc/bleu + t-shirt crème Posé Comme Jamais dégradé. Style complet.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-9.jpeg',
                'variants' => self::colorSizes('Crème', '#F5F0E6', 'PCJ-PACK-CREME', [10, 18, 15, 10], 'media/tshirt/product-9.jpeg'),
            ],
            [
                'name' => 'Pack Casquette & T-shirt PCJ Essentiel',
                'description' => 'Duo blanc Essentiel : casquette logo PCJ + t-shirt Osé Comme Jamais DR Congo. Look net et affirmé.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-10.jpeg',
                'variants' => self::colorSizes('Blanc', '#FFFFFF', 'PCJ-PACK-ESS', [10, 18, 15, 10], 'media/tshirt/product-10.jpeg'),
            ],
            [
                'name' => 'Pull First Generation',
                'description' => 'Hoodie orange brique Posé Comme Jamais, première génération. Poche kangourou, look street iconique.',
                'price' => 21.0,
                'category_id' => $pull,
                'status' => 'IN_STOCK',
                'image' => 'media/pull/product-1.jpeg',
                'variants' => self::colorSizes('Orange', '#C45C26', 'PCJ-PULL-FG', [12, 20, 16, 10], 'media/pull/product-1.jpeg'),
            ],
        ];

        $variantService = app(ProductVariantService::class);
        $created = [];

        foreach ($catalog as $row) {
            $variants = $row['variants'];
            $image = $row['image'];
            unset($row['variants'], $row['image']);

            $product = Product::create(array_merge($row, [
                'vendor_id' => $store->id,
                'stock' => 0,
            ]));

            $variants = array_map(function (array $variant) use ($product) {
                if (! empty($variant['image']) && is_string($variant['image'])) {
                    $variant['image'] = $this->storeMediaPath($variant['image'], 'products/variants/'.$product->id);
                }

                return $variant;
            }, $variants);

            $variantService->syncVariants($product, $variants);
            $this->attachProductImage($product, $image);
            $created[$product->name] = $product;
        }

        $orderService = app(OrderService::class);

        $sophie = $customers[0];
        $marc = $customers[1];
        $lea = $customers[2];

        $teeOfficiel = $created['T-shirt PCJ Officiel'];
        $teeMinimal = $created['T-shirt PCJ Blanc Minimal'];
        $teePose = $created['T-shirt Posé Comme Jamais'];
        $capTrucker = $created['Casquette PCJ Trucker'];

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeOfficiel->id, 'quantity' => 1, 'price' => (float) $teeOfficiel->price],
                ['product_id' => $teeOfficiel->id, 'quantity' => 2, 'price' => (float) $teeOfficiel->price],
            ],
            'total' => 3 * (float) $teeOfficiel->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($marc, OrderData::from([
            'customer_id' => $marc->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teePose->id, 'quantity' => 1, 'price' => (float) $teePose->price],
            ],
            'total' => (float) $teePose->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($lea, OrderData::from([
            'customer_id' => $lea->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $capTrucker->id, 'quantity' => 1, 'price' => (float) $capTrucker->price],
                ['product_id' => $teePose->id, 'quantity' => 2, 'price' => (float) $teePose->price],
            ],
            'total' => (float) $capTrucker->price + 2 * (float) $teePose->price,
            'status' => 'PENDING',
        ]));

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeMinimal->id, 'quantity' => 2, 'price' => (float) $teeMinimal->price],
            ],
            'total' => 2 * (float) $teeMinimal->price,
            'status' => 'PAID',
        ]));

        ProductReview::query()->updateOrCreate(
            ['customer_id' => $sophie->id, 'product_id' => $teeOfficiel->id],
            ['rating' => 5, 'comment' => 'Qualité au rendez-vous, le logo PCJ ressort super bien.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $marc->id, 'product_id' => $teePose->id],
            ['rating' => 4, 'comment' => 'Couleur vive, message qui claque. Coupe top.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $lea->id, 'product_id' => $capTrucker->id],
            ['rating' => 5, 'comment' => 'Casquette confortable, logo bien brodé.'],
        );

        $sophie->favoriteProducts()->syncWithoutDetaching([
            $teeOfficiel->id,
            $teePose->id,
            $teeMinimal->id,
        ]);
        $marc->favoriteProducts()->syncWithoutDetaching([$teePose->id]);
    }

    /**
     * @param  list<int>  $stocks  stocks S, M, L, XL
     * @return list<array{color: string, color_hex: string, size: string, sku: string, stock: int, image: string}>
     */
    private static function colorSizes(string $color, string $hex, string $skuPrefix, array $stocks, string $image): array
    {
        $sizes = ['S', 'M', 'L', 'XL'];

        return array_map(
            fn (string $size, int $i) => [
                'color' => $color,
                'color_hex' => $hex,
                'size' => $size,
                'sku' => $skuPrefix.'-'.$size,
                'stock' => $stocks[$i] ?? 10,
                'image' => $image,
            ],
            $sizes,
            array_keys($sizes),
        );
    }

    private function storeMediaPath(string $mediaPath, string $destDir): ?string
    {
        $source = resource_path($mediaPath);

        if (! File::exists($source)) {
            return null;
        }

        $extension = strtolower(pathinfo($mediaPath, PATHINFO_EXTENSION) ?: 'jpeg');
        $destPath = trim($destDir, '/').'/'.pathinfo($mediaPath, PATHINFO_FILENAME).'.'.$extension;

        Storage::disk('public')->put($destPath, File::get($source));

        return $destPath;
    }

    private function attachProductImage(Product $product, string $mediaPath): void
    {
        $destPath = $this->storeMediaPath($mediaPath, 'products');

        if ($destPath === null) {
            return;
        }

        // Un fichier unique par produit pour éviter les collisions au reseed
        $extension = pathinfo($destPath, PATHINFO_EXTENSION);
        $uniquePath = 'products/'.pathinfo($mediaPath, PATHINFO_FILENAME).'-'.$product->id.'.'.$extension;
        Storage::disk('public')->put($uniquePath, Storage::disk('public')->get($destPath));
        $product->update(['image' => $uniquePath]);
    }
}
