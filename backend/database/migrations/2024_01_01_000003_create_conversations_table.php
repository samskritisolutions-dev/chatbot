<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->string('bot_uid', 64)->index();
            $table->string('session_id', 64)->index();
            $table->enum('role', ['user', 'assistant', 'agent']);
            $table->text('message');
            $table->boolean('taken_over')->default(false);
            $table->unsignedBigInteger('agent_id')->nullable();
            $table->timestamps();

            $table->index(['bot_uid', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
