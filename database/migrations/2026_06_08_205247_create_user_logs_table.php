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
    Schema::create('user_logs', function (Blueprint $table) {
            $table->id();
            $table->string('user_name');
            $table->string('email')->nullable(); // Zorunluluğu kaldırdık
            $table->string('phone')->nullable(); // Zorunluluğu kaldırdık
            $table->string('title')->nullable(); // Zorunluluğu kaldırdık
            $table->string('action'); // "Giriş Yaptı" veya "Çıkış Yaptı"
            $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_logs');
    }
};
