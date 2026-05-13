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
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $now = Date::now();

        User::updateOrCreate(
            ['email' => 'admin@boutique.test'],
            [
                'name' => 'Administrateur',
                'password' => bcrypt('password'),
                'role' => 'ADMIN',
                'email_verified_at' => $now,
            ]
        );

        $categories = collect([
            'Robes',
            'Pantalons',
            'Hauts',
            'Chaussures',
            'Accessoires',
        ])->mapWithKeys(fn (string $name) => [$name => Category::firstOrCreate(['name' => $name])]);

        $vendorUserA = User::updateOrCreate(
            ['email' => 'emma@boutique.test'],
            [
                'name' => 'Emma Martin',
                'password' => bcrypt('password'),
                'role' => 'VENDOR',
                'email_verified_at' => $now,
            ]
        );
        $vendorA = Vendor::firstOrCreate(
            ['user_id' => $vendorUserA->id],
            ['shop_name' => 'Atelier Emma']
        );

        $vendorUserB = User::updateOrCreate(
            ['email' => 'lucas@boutique.test'],
            [
                'name' => 'Lucas Bernard',
                'password' => bcrypt('password'),
                'role' => 'VENDOR',
                'email_verified_at' => $now,
            ]
        );
        $vendorB = Vendor::firstOrCreate(
            ['user_id' => $vendorUserB->id],
            ['shop_name' => 'Mode Lucas']
        );

        $orderIds = Order::query()
            ->whereIn('vendor_id', [$vendorA->id, $vendorB->id])
            ->pluck('id');
        if ($orderIds->isNotEmpty()) {
            OrderItem::query()->whereIn('order_id', $orderIds)->delete();
        }
        Order::query()->whereIn('vendor_id', [$vendorA->id, $vendorB->id])->delete();
        Product::query()->whereIn('vendor_id', [$vendorA->id, $vendorB->id])->delete();

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

        $productsA = [
            ['name' => 'Robe midi lin', 'description' => 'Robe fluide, coupe droite.', 'price' => 89.9, 'stock' => 24, 'category_id' => $robe, 'status' => 'IN_STOCK'],
            ['name' => 'Chemise coton bio', 'description' => 'Chemise blanche col classique.', 'price' => 49.5, 'stock' => 5, 'category_id' => $haut, 'status' => 'LOW_STOCK'],
            ['name' => 'Jean slim indigo', 'description' => 'Denim stretch confortable.', 'price' => 79.0, 'stock' => 0, 'category_id' => $pantalon, 'status' => 'OUT_OF_STOCK'],
        ];

        foreach ($productsA as $row) {
            Product::create(array_merge($row, ['vendor_id' => $vendorA->id]));
        }

        $productsB = [
            ['name' => 'Sneakers urbaines', 'description' => 'Semelle amortissante.', 'price' => 119.0, 'stock' => 15, 'category_id' => $chaussure, 'status' => 'IN_STOCK'],
            ['name' => 'T-shirt oversize', 'description' => 'Coton peigné.', 'price' => 29.9, 'stock' => 80, 'category_id' => $haut, 'status' => 'IN_STOCK'],
            ['name' => 'Ceinture cuir', 'description' => 'Boucle argentée.', 'price' => 45.0, 'stock' => 3, 'category_id' => $categories['Accessoires']->id, 'status' => 'LOW_STOCK'],
        ];

        foreach ($productsB as $row) {
            Product::create(array_merge($row, ['vendor_id' => $vendorB->id]));
        }

        $pEmmaRobe = Product::where('vendor_id', $vendorA->id)->where('name', 'Robe midi lin')->first();
        $pEmmaChemise = Product::where('vendor_id', $vendorA->id)->where('name', 'Chemise coton bio')->first();
        $pLucasSneakers = Product::where('vendor_id', $vendorB->id)->where('name', 'Sneakers urbaines')->first();
        $pLucasTee = Product::where('vendor_id', $vendorB->id)->where('name', 'T-shirt oversize')->first();

        $orderService = app(OrderService::class);

        $sophie = $customers[0];
        $marc = $customers[1];
        $lea = $customers[2];

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $vendorA->id,
            'items' => [
                ['product_id' => $pEmmaRobe->id, 'quantity' => 1, 'price' => (float) $pEmmaRobe->price],
                ['product_id' => $pEmmaChemise->id, 'quantity' => 2, 'price' => (float) $pEmmaChemise->price],
            ],
            'total' => (float) $pEmmaRobe->price + 2 * (float) $pEmmaChemise->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($marc, OrderData::from([
            'customer_id' => $marc->id,
            'vendor_id' => $vendorA->id,
            'items' => [
                ['product_id' => $pEmmaRobe->id, 'quantity' => 1, 'price' => (float) $pEmmaRobe->price],
            ],
            'total' => (float) $pEmmaRobe->price,
            'status' => 'PAID',
        ]));

        $orderService->createOrder($lea, OrderData::from([
            'customer_id' => $lea->id,
            'vendor_id' => $vendorB->id,
            'items' => [
                ['product_id' => $pLucasSneakers->id, 'quantity' => 1, 'price' => (float) $pLucasSneakers->price],
                ['product_id' => $pLucasTee->id, 'quantity' => 3, 'price' => (float) $pLucasTee->price],
            ],
            'total' => (float) $pLucasSneakers->price + 3 * (float) $pLucasTee->price,
            'status' => 'PENDING',
        ]));

        $orderService->createOrder($sophie, OrderData::from([
            'customer_id' => $sophie->id,
            'vendor_id' => $vendorB->id,
            'items' => [
                ['product_id' => $pLucasTee->id, 'quantity' => 2, 'price' => (float) $pLucasTee->price],
            ],
            'total' => 2 * (float) $pLucasTee->price,
            'status' => 'PAID',
        ]));

        ProductReview::query()->updateOrCreate(
            ['customer_id' => $sophie->id, 'product_id' => $pEmmaRobe->id],
            ['rating' => 5, 'comment' => 'Qualité au rendez-vous, coupe parfaite.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $marc->id, 'product_id' => $pEmmaRobe->id],
            ['rating' => 4, 'comment' => 'Très jolie robe, livraison rapide.'],
        );
        ProductReview::query()->updateOrCreate(
            ['customer_id' => $lea->id, 'product_id' => $pLucasSneakers->id],
            ['rating' => 5, 'comment' => 'Confortables au quotidien.'],
        );

        $sophie->favoriteProducts()->syncWithoutDetaching([
            $pEmmaRobe->id,
            $pLucasSneakers->id,
        ]);
        $marc->favoriteProducts()->syncWithoutDetaching([$pLucasTee->id]);
    }
}
