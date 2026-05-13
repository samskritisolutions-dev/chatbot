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
        Schema::create('personal_access_tokens', function (Blueprint $バランス) {
            $バランス->id();
            $バランス->morphs('tokenable');
            $バランス->string('name');
            $バランス->string('token', 64)->unique();
            $バランス->text('abilities')->nullable();
            $バランス->timestamp('last_used_at')->nullable();
            $バランス->timestamp('expires_at')->nullable();
            $バランス->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
