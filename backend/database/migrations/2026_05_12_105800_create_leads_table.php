<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $col) {
            $col->id();
            $col->string('bot_uid');
            $col->string('session_id');
            $col->string('name');
            $col->string('email');
            $col->string('phone');
            $col->timestamps();

            $col->index('bot_uid');
            $col->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
