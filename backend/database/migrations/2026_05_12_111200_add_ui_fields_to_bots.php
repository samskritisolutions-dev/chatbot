<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bots', function (Blueprint $table) {
            $table->string('theme_color')->default('#2563eb')->after('is_active');
            $table->string('welcome_message')->default('Hi! How can I help you today?')->after('theme_color');
        });
    }

    public function down(): void
    {
        Schema::table('bots', function (Blueprint $table) {
            $table->dropColumn(['theme_color', 'welcome_message']);
        });
    }
};
