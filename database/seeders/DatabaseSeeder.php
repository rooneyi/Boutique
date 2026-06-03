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

        $categories = collect([
            'Robes',
            'Pantalons',
            'Hauts',
            'Chaussures',
            'Accessoires',
        ])->mapWithKeys(fn (string $name) => [$name => Category::firstOrCreate(['name' => $name])]);

        $orderIds = Order::query()->where('vendor_id', $store->id)->pluck('id');
        if ($orderIds->isNotEmpty()) {
            OrderItem::query()->whereIn('order_id', $orderIds)->delete();
        }
        Order::query()->where('vendor_id', $store->id)->delete();
        Product::query()->where('vendor_id', $store->id)->delete();

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

        $robe = $categories['Robes']->id;
        $haut = $categories['Hauts']->id;
        $pantalon = $categories['Pantalons']->id;
        $chaussure = $categories['Chaussures']->id;

        $catalog = [
            ['name' => 'Robe midi lin', 'description' => 'Robe fluide, coupe droite.', 'price' => 89.9, 'stock' => 24, 'category_id' => $robe, 'status' => 'IN_STOCK'],
            ['name' => 'Chemise coton bio', 'description' => 'Chemise blanche col classique.', 'price' => 49.5, 'stock' => 5, 'category_id' => $haut, 'status' => 'LOW_STOCK'],
            ['name' => 'Jean slim indigo', 'description' => 'Denim stretch confortable.', 'price' => 79.0, 'stock' => 0, 'category_id' => $pantalon, 'status' => 'OUT_OF_STOCK'],
            ['name' => 'Sneakers urbaines', 'description' => 'Semelle amortissante.', 'price' => 119.0, 'stock' => 15, 'category_id' => $chaussure, 'status' => 'IN_STOCK'],
            ['name' => 'T-shirt oversize', 'description' => 'Coton peigné.', 'price' => 29.9, 'stock' => 80, 'category_id' => $haut, 'status' => 'IN_STOCK'],
            ['name' => 'Ceinture cuir', 'description' => 'Boucle argentée.', 'price' => 45.0, 'stock' => 3, 'category_id' => $categories['Accessoires']->id, 'status' => 'LOW_STOCK'],
        ];

        $variantService = app(ProductVariantService::class);

        foreach ($catalog as $row) {
            $product = Product::create(array_merge($row, ['vendor_id' => $store->id, 'stock' => 0]));
            $variantService->syncVariants($product, match ($product->name) {
                'Robe midi lin' => [
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'M', 'sku' => 'ROBE-NOIR-M', 'stock' => 8],
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'L', 'sku' => 'ROBE-NOIR-L', 'stock' => 6],
                    ['color' => 'Bleu', 'color_hex' => '#0059DD', 'size' => 'M', 'sku' => 'ROBE-BLEU-M', 'stock' => 10],
                ],
                'Chemise coton bio' => [
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'S', 'sku' => 'CHEM-BLANC-S', 'stock' => 2],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => 'M', 'sku' => 'CHEM-BLANC-M', 'stock' => 3],
                ],
                'Sneakers urbaines' => [
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => '40', 'sku' => 'SNK-NOIR-40', 'stock' => 5],
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => '42', 'sku' => 'SNK-NOIR-42', 'stock' => 10],
                    ['color' => 'Blanc', 'color_hex' => '#FFFFFF', 'size' => '42', 'sku' => 'SNK-BLANC-42', 'stock' => 0],
                ],
                'T-shirt oversize' => [
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'M', 'sku' => 'TEE-NOIR-M', 'stock' => 40],
                    ['color' => 'Noir', 'color_hex' => '#000000', 'size' => 'L', 'sku' => 'TEE-NOIR-L', 'stock' => 40],
                ],
                default => [
                    ['color' => 'Gris', 'color_hex' => '#BFBFBF', 'size' => 'M', 'sku' => 'SKU-'.$product->id.'-M', 'stock' => max(0, (int) $row['stock'])],
                ],
            });
        }

        $pRobe = Product::where('vendor_id', $store->id)->where('name', 'Robe midi lin')->first();
        $pChemise = Product::where('vendor_id', $store->id)->where('name', 'Chemise coton bio')->first();
        $pSneakers = Product::where('vendor_id', $store->id)->where('name', 'Sneakers urbaines')->first();
        $pTee = Product::where('vendor_id', $store->id)->where('name', 'T-shirt oversize')->first();

        $orderService = app(OrderService::class);

        $sophie = $customers[0];
        $marc = $customers[1];
        $lea = $customers[2];

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $pRobe->id, 'quantity' => 1, 'price' => (float) $pRobe->price],
                ['product_id' => $pChemise->id, 'quantity' => 2, 'price' => (float) $pChemise->price],
            ],
            'total' => (float) $pRobe->price + 2 * (float) $pChemise->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($marc, OrderData::from([
            'customer_id' => $marc->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $pRobe->id, 'quantity' => 1, 'price' => (float) $pRobe->price],
            ],
            'total' => (float) $pRobe->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($lea, OrderData::from([
            'customer_id' => $lea->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $pSneakers->id, 'quantity' => 1, 'price' => (float) $pSneakers->price],
                ['product_id' => $pTee->id, 'quantity' => 3, 'price' => (float) $pTee->price],
            ],
            'total' => (float) $pSneakers->price + 3 * (float) $pTee->price,
            'status' => 'PENDING',
        ]));

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $store->id,
            'items' => [
                ['product_id' => $pTee->id, 'quantity' => 2, 'price' => (float) $pTee->price],
            ],
            'total' => 2 * (float) $pTee->price,
            'status' => 'PAID',
        ]));

        ProductReview::query()->updateOrCreate(
            ['customer_id' => $sophie->id, 'product_id' => $pRobe->id],
            ['rating' => 5, 'comment' => 'Qualité au rendez-vous, coupe parfaite.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $marc->id, 'product_id' => $pRobe->id],
            ['rating' => 4, 'comment' => 'Très jolie robe, livraison rapide.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $lea->id, 'product_id' => $pSneakers->id],
            ['rating' => 5, 'comment' => 'Confortables au quotidien.'],
        );

        $sophie->favoriteProducts()->syncWithoutDetaching([
            $pRobe->id,
            $pSneakers->id,
        ]);
        $marc->favoriteProducts()->syncWithoutDetaching([$pTee->id]);
    }
}
