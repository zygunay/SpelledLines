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
    Schema::create('user_action_logs', function (Blueprint $table) {
        $table->id();
        $table->string('admin_name');   // İşlemi gerçekleştiren yönetici
        $table->string('target_name');  // Etkilenen/Silinen personelin adı
        $table->string('action');       // 'Yetki Değiştirildi' veya 'Sistemden Silindi'
        $table->text('reason')->nullable(); // İşlemin yapılma nedeni
        $table->timestamps();           // İşlem zamanı
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_action_logs');
    }
};
