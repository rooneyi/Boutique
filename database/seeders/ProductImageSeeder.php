<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductImageSeeder extends Seeder
{
    public function run(): void
    {
        $products = Product::query()->with('category')->orderBy('id')->get();

        if ($products->isEmpty()) {
            $this->command?->warn('Aucun produit en base.');

            return;
        }

        $assigned = 0;

        $products
            ->groupBy(fn (Product $product) => $this->folderForCategory($product->category?->name))
            ->each(function (Collection $group, string $folder) use (&$assigned) {
                $files = $this->imagesForFolder($folder, $group->first()?->category?->name);

                if ($files->isEmpty()) {
                    return;
                }

                foreach ($group->values() as $index => $product) {
                    $source = $files[$index % $files->count()];
                    $destPath = "products/{$folder}-".pathinfo($source, PATHINFO_FILENAME).'-'.$product->id.'.jpeg';

                    if ($product->image && $product->image !== $destPath) {
                        Storage::disk('public')->delete($product->image);
                    }

                    Storage::disk('public')->put($destPath, File::get($source));
                    $product->update(['image' => $destPath]);
                    $assigned++;
                }
            });

        $this->command?->info("Images assignées à {$assigned} produit(s).");
    }

    /**
     * @return Collection<int, string>
     */
    private function imagesForFolder(string $folder, ?string $categoryName): Collection
    {
        $files = collect(glob(resource_path("media/{$folder}/product-*.jpeg")))
            ->sort()
            ->values();

        $name = Str::lower(trim($categoryName ?? ''));

        if ($folder === 'tshirt' && str_contains($name, 't-shirt')) {
            return $files
                ->filter(fn (string $path) => preg_match('/product-(?:[1-9]|10)\.jpeg$/', $path) === 1)
                ->values();
        }

        return $files;
    }

    private function folderForCategory(?string $categoryName): string
    {
        $name = Str::lower(trim($categoryName ?? ''));

        if (str_contains($name, 'casquette')) {
            return 'casquette';
        }

        if (str_contains($name, 'pull')) {
            return 'pull';
        }

        if (str_contains($name, 'pack')) {
            return 'tshirt';
        }

        return 'tshirt';
    }
}
