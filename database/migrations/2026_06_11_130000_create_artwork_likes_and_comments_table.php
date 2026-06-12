<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('artwork_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('artwork_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamps();

            $table->unique(['artwork_id', 'user_id']);
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::create('artwork_comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('artwork_id');
            $table->unsignedBigInteger('user_id');
            $table->text('comment');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('artwork_comments');
        Schema::dropIfExists('artwork_likes');
    }
};
