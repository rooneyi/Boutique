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

        // Catalogue réel PCJ — images dans resources/media (prêt déploiement)
        $catalog = [
            [
                'name' => 'T-shirt PCJ Beige Logo',
                'description' => 'T-shirt beige coupe relax, logo PCJ circulaire noir au centre. Coton doux, style affiché.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-1.jpeg',
                'variants' => [
                    ['color' => 'Beige', 'color_hex' => '#C4A882', 'size' => 'S', 'sku' => 'PCJ-TEE-BEIGE-S', 'stock' => 15],
                    ['color' => 'Beige', 'color_hex' => '#C4A882', 'size' => 'M', 'sku' => 'PCJ-TEE-BEIGE-M', 'stock' => 25],
                    ['color' => 'Beige', 'color_hex' => '#C4A882', 'size' => 'L', 'sku' => 'PCJ-TEE-BEIGE-L', 'stock' => 20],
                    ['color' => 'Beige', 'color_hex' => '#C4A882', 'size' => 'XL', 'sku' => 'PCJ-TEE-BEIGE-XL', 'stock' => 12],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Blanc Minimal',
                'description' => 'T-shirt blanc essentiel, petit logo PCJ discret sur le cœur. Coupe moderne au quotidien.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-2.jpeg',
                'variants' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'S', 'sku' => 'PCJ-TEE-MIN-S', 'stock' => 18],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'PCJ-TEE-MIN-M', 'stock' => 30],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'L', 'sku' => 'PCJ-TEE-MIN-L', 'stock' => 28],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'XL', 'sku' => 'PCJ-TEE-MIN-XL', 'stock' => 14],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Officiel',
                'description' => 'T-shirt blanc officiel PCJ, grand logo circulaire noir. La pièce signature de la marque.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-3.jpeg',
                'variants' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'S', 'sku' => 'PCJ-TEE-BLANC-S', 'stock' => 20],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'PCJ-TEE-BLANC-M', 'stock' => 32],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'L', 'sku' => 'PCJ-TEE-BLANC-L', 'stock' => 26],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'XL', 'sku' => 'PCJ-TEE-BLANC-XL', 'stock' => 16],
                ],
            ],
            [
                'name' => 'T-shirt Posé Comme Jamais Jaune',
                'description' => 'T-shirt jaune vif, message POSÉ COMME JAMAIS en blanc. Attitude affirmée.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-4.jpeg',
                'variants' => [
                    ['color' => 'Jaune', 'color_hex' => '#F5C518', 'size' => 'S', 'sku' => 'PCJ-TEE-JAUNE-S', 'stock' => 12],
                    ['color' => 'Jaune', 'color_hex' => '#F5C518', 'size' => 'M', 'sku' => 'PCJ-TEE-JAUNE-M', 'stock' => 22],
                    ['color' => 'Jaune', 'color_hex' => '#F5C518', 'size' => 'L', 'sku' => 'PCJ-TEE-JAUNE-L', 'stock' => 18],
                    ['color' => 'Jaune', 'color_hex' => '#F5C518', 'size' => 'XL', 'sku' => 'PCJ-TEE-JAUNE-XL', 'stock' => 10],
                ],
            ],
            [
                'name' => 'T-shirt PCJ Bleu Logo',
                'description' => 'T-shirt bleu électrique, logo PCJ blanc circulaire. Couleur forte, look street.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-5.jpeg',
                'variants' => [
                    ['color' => 'Bleu', 'color_hex' => '#1E5AFF', 'size' => 'S', 'sku' => 'PCJ-TEE-BLEU-S', 'stock' => 14],
                    ['color' => 'Bleu', 'color_hex' => '#1E5AFF', 'size' => 'M', 'sku' => 'PCJ-TEE-BLEU-M', 'stock' => 24],
                    ['color' => 'Bleu', 'color_hex' => '#1E5AFF', 'size' => 'L', 'sku' => 'PCJ-TEE-BLEU-L', 'stock' => 20],
                    ['color' => 'Bleu', 'color_hex' => '#1E5AFF', 'size' => 'XL', 'sku' => 'PCJ-TEE-BLEU-XL', 'stock' => 12],
                ],
            ],
            [
                'name' => 'T-shirt Posé Comme Jamais Blanc Or',
                'description' => 'T-shirt blanc, typo POSÉ COMME JAMAIS dorée. Pièce signature sobre et chic.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-6.jpeg',
                'variants' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'S', 'sku' => 'PCJ-TEE-OR-S', 'stock' => 16],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'PCJ-TEE-OR-M', 'stock' => 28],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'L', 'sku' => 'PCJ-TEE-OR-L', 'stock' => 22],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'XL', 'sku' => 'PCJ-TEE-OR-XL', 'stock' => 14],
                ],
            ],
            [
                'name' => 'T-shirt Posé Comme Jamais Rose',
                'description' => 'T-shirt rose pâle, message POSÉ COMME JAMAIS en contour noir. Doux et affirmé.',
                'price' => 11.0,
                'category_id' => $tshirt,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-7.jpeg',
                'variants' => [
                    ['color' => 'Rose', 'color_hex' => '#F2C4C4', 'size' => 'S', 'sku' => 'PCJ-TEE-ROSE-S', 'stock' => 15],
                    ['color' => 'Rose', 'color_hex' => '#F2C4C4', 'size' => 'M', 'sku' => 'PCJ-TEE-ROSE-M', 'stock' => 26],
                    ['color' => 'Rose', 'color_hex' => '#F2C4C4', 'size' => 'L', 'sku' => 'PCJ-TEE-ROSE-L', 'stock' => 20],
                    ['color' => 'Rose', 'color_hex' => '#F2C4C4', 'size' => 'XL', 'sku' => 'PCJ-TEE-ROSE-XL', 'stock' => 12],
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
                    ['color' => 'Vert', 'color_hex' => '#3D5A3D', 'size' => 'TU', 'sku' => 'PCJ-CAP-VERT-TU', 'stock' => 40],
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
                    ['color' => 'Gris', 'color_hex' => '#4A4A4A', 'size' => 'TU', 'sku' => 'PCJ-CAP-ESS-TU', 'stock' => 45],
                ],
            ],
            [
                'name' => 'Casquette PCJ',
                'description' => 'Casquette trucker blanc et bleu, message POSÉ COMME JAMAIS. Style street affirmé.',
                'price' => 5.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-3.jpeg',
                'variants' => [
                    ['color' => 'Bleu', 'color_hex' => '#1E4DFF', 'size' => 'TU', 'sku' => 'PCJ-CAP-BLEU-TU', 'stock' => 40],
                ],
            ],
            [
                'name' => 'Casquette PCJ Bleu',
                'description' => 'Casquette trucker bleu roi, typo POSÉ COMME JAMAIS dorée. Look net et marqué.',
                'price' => 5.0,
                'category_id' => $casquette,
                'status' => 'IN_STOCK',
                'image' => 'media/casquette/product-4.jpeg',
                'variants' => [
                    ['color' => 'Bleu', 'color_hex' => '#1A3DFF', 'size' => 'TU', 'sku' => 'PCJ-CAP-BLEU-OR-TU', 'stock' => 40],
                ],
            ],
            [
                'name' => 'Pack Casquette & T-shirt',
                'description' => 'Ensemble PCJ : casquette Essentiel + t-shirt Posé Comme Jamais. Le duo complet à prix pack.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-8.jpeg',
                'variants' => [
                    ['color' => 'Gris', 'color_hex' => '#B8B8B8', 'size' => 'S', 'sku' => 'PCJ-PACK-GRIS-S', 'stock' => 10],
                    ['color' => 'Gris', 'color_hex' => '#B8B8B8', 'size' => 'M', 'sku' => 'PCJ-PACK-GRIS-M', 'stock' => 18],
                    ['color' => 'Gris', 'color_hex' => '#B8B8B8', 'size' => 'L', 'sku' => 'PCJ-PACK-GRIS-L', 'stock' => 15],
                    ['color' => 'Gris', 'color_hex' => '#B8B8B8', 'size' => 'XL', 'sku' => 'PCJ-PACK-GRIS-XL', 'stock' => 10],
                ],
            ],
            [
                'name' => 'Pack Casquette & T-shirt PCJ',
                'description' => 'Duo PCJ : casquette blanc/bleu + t-shirt crème Posé Comme Jamais dégradé. Style complet.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-9.jpeg',
                'variants' => [
                    ['color' => 'Crème', 'color_hex' => '#F5F0E6', 'size' => 'S', 'sku' => 'PCJ-PACK-CREME-S', 'stock' => 10],
                    ['color' => 'Crème', 'color_hex' => '#F5F0E6', 'size' => 'M', 'sku' => 'PCJ-PACK-CREME-M', 'stock' => 18],
                    ['color' => 'Crème', 'color_hex' => '#F5F0E6', 'size' => 'L', 'sku' => 'PCJ-PACK-CREME-L', 'stock' => 15],
                    ['color' => 'Crème', 'color_hex' => '#F5F0E6', 'size' => 'XL', 'sku' => 'PCJ-PACK-CREME-XL', 'stock' => 10],
                ],
            ],
            [
                'name' => 'Pack Casquette & T-shirt PCJ Essentiel',
                'description' => 'Duo blanc Essentiel : casquette logo PCJ + t-shirt Osé Comme Jamais DR Congo. Look net et affirmé.',
                'price' => 16.0,
                'category_id' => $pack,
                'status' => 'IN_STOCK',
                'image' => 'media/tshirt/product-10.jpeg',
                'variants' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'S', 'sku' => 'PCJ-PACK-ESS-S', 'stock' => 10],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'PCJ-PACK-ESS-M', 'stock' => 18],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'L', 'sku' => 'PCJ-PACK-ESS-L', 'stock' => 15],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'XL', 'sku' => 'PCJ-PACK-ESS-XL', 'stock' => 10],
                ],
            ],
            [
                'name' => 'Pull First Generation',
                'description' => 'Hoodie orange brique Posé Comme Jamais, première génération. Poche kangourou, look street iconique.',
                'price' => 21.0,
                'category_id' => $pull,
                'status' => 'IN_STOCK',
                'image' => 'media/pull/product-1.jpeg',
                'variants' => [
                    ['color' => 'Orange', 'color_hex' => '#C45C26', 'size' => 'S', 'sku' => 'PCJ-PULL-FG-S', 'stock' => 12],
                    ['color' => 'Orange', 'color_hex' => '#C45C26', 'size' => 'M', 'sku' => 'PCJ-PULL-FG-M', 'stock' => 20],
                    ['color' => 'Orange', 'color_hex' => '#C45C26', 'size' => 'L', 'sku' => 'PCJ-PULL-FG-L', 'stock' => 16],
                    ['color' => 'Orange', 'color_hex' => '#C45C26', 'size' => 'XL', 'sku' => 'PCJ-PULL-FG-XL', 'stock' => 10],
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

        $teeBeige = $created['T-shirt PCJ Beige Logo'];
        $teeMinimal = $created['T-shirt PCJ Blanc Minimal'];
        $teeBlanc = $created['T-shirt PCJ Officiel'];
        $teeJaune = $created['T-shirt Posé Comme Jamais Jaune'];
        $teeRose = $created['T-shirt Posé Comme Jamais Rose'];
        $capTrucker = $created['Casquette PCJ Trucker'];

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeBeige->id, 'quantity' => 1, 'price' => (float) $teeBeige->price],
                ['product_id' => $teeBlanc->id, 'quantity' => 2, 'price' => (float) $teeBlanc->price],
            ],
            'total' => (float) $teeBeige->price + 2 * (float) $teeBlanc->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($marc, OrderData::from([
            'customer_id' => $marc->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $teeJaune->id, 'quantity' => 1, 'price' => (float) $teeJaune->price],
            ],
            'total' => (float) $teeJaune->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($lea, OrderData::from([
            'customer_id' => $lea->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $capTrucker->id, 'quantity' => 1, 'price' => (float) $capTrucker->price],
                ['product_id' => $teeRose->id, 'quantity' => 2, 'price' => (float) $teeRose->price],
            ],
            'total' => (float) $capTrucker->price + 2 * (float) $teeRose->price,
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
            ['customer_id' => $sophie->id, 'product_id' => $teeBeige->id],
            ['rating' => 5, 'comment' => 'Qualité au rendez-vous, le logo PCJ ressort super bien.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $marc->id, 'product_id' => $teeJaune->id],
            ['rating' => 4, 'comment' => 'Couleur vive, message qui claque. Coupe top.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $lea->id, 'product_id' => $capTrucker->id],
            ['rating' => 5, 'comment' => 'Casquette confortable, logo bien brodé.'],
        );

        $sophie->favoriteProducts()->syncWithoutDetaching([
            $teeBeige->id,
            $teeBlanc->id,
            $teeRose->id,
        ]);
        $marc->favoriteProducts()->syncWithoutDetaching([$teeJaune->id]);
    }

    private function attachProductImage(Product $product, string $mediaPath): void
    {
        $source = resource_path($mediaPath);

        if (! File::exists($source)) {
            return;
        }

        $extension = strtolower(pathinfo($mediaPath, PATHINFO_EXTENSION) ?: 'jpeg');
        $destPath = 'products/'.pathinfo($mediaPath, PATHINFO_FILENAME).'-'.$product->id.'.'.$extension;

        Storage::disk('public')->put($destPath, File::get($source));
        $product->update(['image' => $destPath]);
    }
}
