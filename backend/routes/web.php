<?php

use Illuminate\Support\Facades\Route;

Route::get('/init-db', function() {
    Artisan::call('migrate --force');
    return "Database tables created!";
});
