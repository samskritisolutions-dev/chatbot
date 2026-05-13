<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
            $table->string('bot_uid', 64)->unique();
            $table->string('bot_name', 100)->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('logo_url')->nullable();
            $table->text('system_prompt')->nullable();
            $table->text('welcome_msg')->nullable();
            $table->text('fallback_msg')->nullable();
            $table->string('widget_color', 20)->default('#0EA5E9');
            $table->string('font_family', 100)->default('Inter, sans-serif');
            $table->enum('position', ['bottom-right', 'bottom-left'])->default('bottom-right');
            $table->text('allowed_domains')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bots');
    }
};
