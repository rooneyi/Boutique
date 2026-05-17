<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('shipping_full_name')->nullable()->after('status');
            $table->string('shipping_whatsapp')->nullable()->after('shipping_full_name');
            $table->text('shipping_address')->nullable()->after('shipping_whatsapp');
            $table->string('shipping_city')->nullable()->after('shipping_address');
            $table->string('shipping_district')->nullable()->after('shipping_city');
            $table->string('payment_method')->nullable()->after('shipping_district');
            $table->text('customer_note')->nullable()->after('payment_method');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shipping_full_name',
                'shipping_whatsapp',
                'shipping_address',
                'shipping_city',
                'shipping_district',
                'payment_method',
                'customer_note',
            ]);
        });
    }
};
