<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_vendor')) {
                $table->boolean('is_vendor')->default(false)->after('password');
            }

            if (!Schema::hasColumn('users', 'is_admin')) {
                $table->boolean('is_admin')->default(false)->after('is_vendor');
            }

            if (!Schema::hasColumn('users', 'shop_name')) {
                $table->string('shop_name')->nullable()->after('is_admin');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columnsToDrop = [];

            if (Schema::hasColumn('users', 'shop_name')) {
                $columnsToDrop[] = 'shop_name';
            }

            if (Schema::hasColumn('users', 'is_admin')) {
                $columnsToDrop[] = 'is_admin';
            }

            if (Schema::hasColumn('users', 'is_vendor')) {
                $columnsToDrop[] = 'is_vendor';
            }

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
