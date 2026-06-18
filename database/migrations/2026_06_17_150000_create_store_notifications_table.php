<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type', 32);
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->text('message')->nullable();
            $table->timestamps();

            $table->index(['type', 'created_at']);
        });

        Schema::create('customer_notification_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_notification_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at');
            $table->timestamps();

            $table->unique(['customer_id', 'store_notification_id'], 'customer_notification_read_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_notification_reads');
        Schema::dropIfExists('store_notifications');
    }
};
