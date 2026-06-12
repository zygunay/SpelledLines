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
        Schema::table('user_action_logs', function (Blueprint $table) {
            // Silinen personelin e-postası ve unvanını tutacak sütunlar
            $table->string('target_email')->nullable()->after('target_name');
            $table->string('target_title')->nullable()->after('target_email');
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_action_logs', function (Blueprint $table) {
            //
        });
    }
};
