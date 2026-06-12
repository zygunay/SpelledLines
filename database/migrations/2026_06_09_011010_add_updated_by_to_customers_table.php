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
    Schema::table('customers', function (Blueprint $table) {
        // Güncelleyen kişinin adını tutacak (boş olabilir, çünkü ilk eklendiğinde güncellenmemiştir)
        $table->string('updated_by')->nullable()->after('added_by'); 
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            //
        });
    }
};
