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

        $categories = collect(['Pull', 'T-shirt', 'Casquette'])
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

        $pull = $categories['Pull']->id;
        $tshirt = $categories['T-shirt']->id;
        $casquette = $categories['Casquette']->id;

        $catalog = [
            [
                'name' => 'T-shirt PCJ Vert Forêt',
                'description' => 'T-shirt oversize en coton, logo PCJ jaune sur fond vert forêt.',
                'price' => 35.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-1.jpeg',
                'variants' => [
                    ['color' => 'Vert', 'color_hex' => '#1B4332', 'size' => 'M', 'sku' => 'PCJ-TEE-VERT-M', 'stock' => 25],
                    ['color' => 'Vert', 'color_hex' => '#1B4332', 'size' => 'L', 'sku' => 'PCJ-TEE-VERT-L', 'stock' => 20],
                    ['color' => 'Vert', 'color_hex' => '#1B4332', 'size' => 'XL', 'sku' => 'PCJ-TEE-VERT-XL', 'stock' => 15],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Oversize Noir',
                'description' => 'Coupe oversize confortable, logo PCJ contrasté, coton peigné.',
                'price' => 32.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-2.jpeg',
                'variants' => [
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'M', 'sku' => 'PCJ-TEE-NOIR-M', 'stock' => 30],
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'L', 'sku' => 'PCJ-TEE-NOIR-L', 'stock' => 28],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Logo Jaune',
                'description' => 'Logo PCJ mis en avant, tissu épais et doux au toucher.',
                'price' => 34.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-3.jpeg',
                'variants' => [
                    ['color' => 'Vert', 'color_hex' => '#2D6A4F', 'size' => 'S', 'sku' => 'PCJ-TEE-LOGO-S', 'stock' => 12],
                    ['color' => 'Vert', 'color_hex' => '#2D6A4F', 'size' => 'M', 'sku' => 'PCJ-TEE-LOGO-M', 'stock' => 18],
                    ['color' => 'Vert', 'color_hex' => '#2D6A4F', 'size' => 'L', 'sku' => 'PCJ-TEE-LOGO-L', 'stock' => 14],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Essentiel',
                'description' => 'Le basique PCJ : coupe moderne, finitions soignées, style au quotidien.',
                'price' => 29.9,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-4.jpeg',
                'variants' => [
                    ['color' => 'Noir', 'color_hex' => '#1A1A1A', 'size' => 'M', 'sku' => 'PCJ-TEE-ESS-M', 'stock' => 40],
                    ['color' => 'Noir', 'color_hex' => '#1A1A1A', 'size' => 'L', 'sku' => 'PCJ-TEE-ESS-L', 'stock' => 35],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'PCJ-TEE-ESS-BLANC-M', 'stock' => 8],
                ],
            ],
            [
                'name' => 'Pull PCJ Maille',
                'description' => 'Pull léger en maille, logo PCJ brodé.',
                'price' => 55.0,
                'category_id' => $pull,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/category-pull.jpeg',
                'variants' => [
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'M', 'sku' => 'PCJ-PULL-NOIR-M', 'stock' => 15],
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'L', 'sku' => 'PCJ-PULL-NOIR-L', 'stock' => 12],
                ],
            ],
            [
                'name' => 'Pull PCJ Oversize',
                'description' => 'Coupe relax, confort optimal pour la mi-saison.',
                'price' => 59.0,
                'category_id' => $pull,
                'status' => 'LOW_STOCK',
                'image' => 'media/tshirt/product-5.jpeg',
                'variants' => [
                    ['color' => 'Gris', 'color_hex' => '#6B6B6B', 'size' => 'L', 'sku' => 'PCJ-PULL-GRIS-L', 'stock' => 4],
                    ['color' => 'Gris', 'color_hex' => '#6B6B6B', 'size' => 'XL', 'sku' => 'PCJ-PULL-GRIS-XL', 'stock' => 3],
                ],
            ],
            [
                'name' => 'Casquette PCJ Trucker',
                'description' => 'Casquette trucker verte, logo PCJ jaune brodé sur le devant.',
                'price' => 25.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-1.jpeg',
                'variants' => [
                    ['color' => 'Vert', 'color_hex' => '#2D6A4F', 'size' => 'TU', 'sku' => 'PCJ-CAP-VERT-TU', 'stock' => 50],
                ],
            ],
            [
                'name' => 'Casquette PCJ Classic',
                'description' => 'Casquette ajustable, mesh arrière, finition premium.',
                'price' => 22.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-1.jpeg',
                'variants' => [
                    ['color' => 'Vert', 'color_hex' => '#1B4332', 'size' => 'TU', 'sku' => 'PCJ-CAP-CLASSIC-TU', 'stock' => 35],
                ],
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

            $variantService->syncVariants($product, $variants);
            $this->attachProductImage($product, $image);
            $created[$product->name] = $product;
        }

        $orderService = app(OrderService::class);

        $sophie = $customers[0];
        $marc = $customers[1];
        $lea = $customers[2];

        $teeVert = $created['T-shirt PCJ Vert Forêt'];
        $teeNoir = $created['T-shirt PCJ Oversize Noir'];
        $teeLogo = $created['T-shirt PCJ Logo Jaune'];
        $teeEss = $created['T-shirt PCJ Essentiel'];
        $pullMaille = $created['Pull PCJ Maille'];
        $capTrucker = $created['Casquette PCJ Trucker'];

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeVert->id, 'quantity' => 1, 'price' => (float) $teeVert->price],
                ['product_id' => $teeNoir->id, 'quantity' => 2, 'price' => (float) $teeNoir->price],
            ],
            'total' => (float) $teeVert->price + 2 * (float) $teeNoir->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($marc, OrderData::from([
            'customer_id' => $marc->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeLogo->id, 'quantity' => 1, 'price' => (float) $teeLogo->price],
            ],
            'total' => (float) $teeLogo->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($lea, OrderData::from([
            'customer_id' => $lea->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $capTrucker->id, 'quantity' => 1, 'price' => (float) $capTrucker->price],
                ['product_id' => $teeEss->id, 'quantity' => 3, 'price' => (float) $teeEss->price],
            ],
            'total' => (float) $capTrucker->price + 3 * (float) $teeEss->price,
            'status' => 'PENDING',
        ]));

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeEss->id, 'quantity' => 2, 'price' => (float) $teeEss->price],
            ],
            'total' => 2 * (float) $teeEss->price,
            'status' => 'PAID',
        ]));

        ProductReview::query()->updateOrCreate(
            ['customer_id' => $sophie->id, 'product_id' => $teeVert->id],
            ['rating' => 5, 'comment' => 'Qualité au rendez-vous, le logo PCJ ressort super bien.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $marc->id, 'product_id' => $teeLogo->id],
            ['rating' => 4, 'comment' => 'Très beau t-shirt, coupe oversize parfaite.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $lea->id, 'product_id' => $capTrucker->id],
            ['rating' => 5, 'comment' => 'Casquette confortable, logo bien brodé.'],
        );

        $sophie->favoriteProducts()->syncWithoutDetaching([
            $teeVert->id,
            $teeNoir->id,
            $pullMaille->id,
        ]);
        $marc->favoriteProducts()->syncWithoutDetaching([$teeEss->id]);
    }

    private function attachProductImage(Product $product, string $mediaPath): void
    {
        $source = resource_path($mediaPath);

        if (! File::exists($source)) {
            return;
        }

        $destPath = 'products/'.pathinfo($mediaPath, PATHINFO_FILENAME).'-'.$product->id.'.jpeg';

        Storage::disk('public')->put($destPath, File::get($source));
        $product->update(['image' => $destPath]);
    }
}
