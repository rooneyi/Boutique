<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['ADMIN', 'VENDOR', 'CUSTOMER'])->after('password');
            
            $table->dropColumn(['is_vendor', 'is_admin', 'shop_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
            
            $table->boolean('is_vendor')->default(false)->after('password');
            $table->boolean('is_admin')->default(false)->after('is_vendor');
            $table->string('shop_name')->nullable()->after('is_admin');
        });
    }
};
