<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BotController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\LeadController;

// ── Public Auth ──────────────────────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

// Google Login
Route::get('/auth/google',          [\App\Http\Controllers\SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [\App\Http\Controllers\SocialAuthController::class, 'handleGoogleCallback']);

// ── Public Widget (no auth — called by embed widget.js) ─────────────────────
Route::prefix('widget/{botUid}')->group(function () {
    Route::get('config',  [ChatController::class, 'config']);
    Route::post('chat',   [ChatController::class, 'chat']);
    Route::get('history', [ChatController::class, 'history']);
});

// ── Authenticated Client Routes ──────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

    // Bots
    Route::apiResource('bots', BotController::class);
    Route::get('bots/{bot}/embed', [BotController::class, 'embedCode']);

    // Conversations
    Route::get('conversations',             [ConversationController::class, 'index']);
    Route::get('conversations/{session}',   [ConversationController::class, 'show']);

    // Agent live takeover
    Route::post('conversations/{session}/takeover', [AgentController::class, 'takeover']);
    Route::post('conversations/{session}/reply',    [AgentController::class, 'reply']);

    // Training
    Route::get('training', [TrainingController::class, 'index']);
    Route::post('training/upload', [TrainingController::class, 'upload']);
    Route::post('training/url',    [TrainingController::class, 'importUrl']);
    Route::post('training/text',   [TrainingController::class, 'importText']);
    Route::delete('training/{id}', [TrainingController::class, 'destroy']);

    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index']);

    // Leads
    Route::get('leads', [LeadController::class, 'index']);
    Route::delete('leads/{id}', [LeadController::class, 'destroy']);

    // ── Super Admin Routes ────────────────────────────────────────────────────
    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('stats',          [\App\Http\Controllers\SuperAdminController::class, 'stats']);
        Route::get('clients',        [\App\Http\Controllers\SuperAdminController::class, 'clients']);
        Route::get('conversations',  [\App\Http\Controllers\SuperAdminController::class, 'allConversations']);
        Route::get('message-volume', [\App\Http\Controllers\SuperAdminController::class, 'messageVolume']);
        Route::post('clients/{client}/toggle', [\App\Http\Controllers\SuperAdminController::class, 'toggleClientStatus']);
        Route::post('clients/{client}/plan',   [\App\Http\Controllers\SuperAdminController::class, 'updatePlan']);
    });
});
