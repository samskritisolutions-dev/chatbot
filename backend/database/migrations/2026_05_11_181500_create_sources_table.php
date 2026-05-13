<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sources', function (Blueprint $blueprint) {
            $blueprint->id();
            $blueprint->string('bot_uid')->index();
            $blueprint->string('type'); // file, url, text
            $blueprint->string('name');
            $blueprint->longText('content')->nullable(); // The actual text extracted
            $blueprint->string('file_path')->nullable();
            $blueprint->string('status')->default('training'); // training, ready, error
            $blueprint->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sources');
    }
};
