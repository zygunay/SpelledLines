<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_action_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete();
            $table->string('admin_name')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('action');
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_action_logs');
    }
};
