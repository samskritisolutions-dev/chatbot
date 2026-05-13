<?php

namespace App\Http\Controllers;

use App\Models\Bot;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();

        $botUids = $user->bots()->pluck('bot_uid');

        // 1. Total Chats (Unique Sessions)
        $totalChats = Conversation::whereIn('bot_uid', $botUids)
            ->distinct('session_id')
            ->count('session_id');

        // 2. Active Bots
        $activeBots = $user->bots()->where('is_active', true)->count();

        // 3. New Leads (For now, we'll count unique visitors/sessions as leads)
        $newLeads = $totalChats; 

        // 4. Activity Graph (Last 7 Days)
        $activity = Conversation::whereIn('bot_uid', $botUids)
        ->where('created_at', '>=', Carbon::now()->subDays(7))
        ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
        ->groupBy('date')
        ->orderBy('date', 'ASC')
        ->get();

            return response()->json([
                'stats' => [
                    'total_chats' => $totalChats,
                    'active_bots' => $activeBots,
                    'new_leads'   => $newLeads,
                    'growth'      => '+12.5%' // Mock growth for now
                ],
                'activity' => $activity
            ]);
        } catch (\Exception $e) {
            \Log::error('Analytics Fetch Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
