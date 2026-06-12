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
    Schema::create('customers', function (Blueprint $table) {
        $table->id();
        $table->string('first_name'); // İsim
        $table->string('last_name');  // Soyisim
        $table->string('email')->unique();
        $table->string('phone');
        $table->string('edit_by');
        $table->string('added_by');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
