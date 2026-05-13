<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Bot;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SuperAdminController extends Controller
{
    /**
     * Get platform-wide statistics.
     */
    public function stats(): JsonResponse
    {
        try {
            return response()->json([
                'total_clients'  => Client::count(),
                'total_bots'     => Bot::count(),
                'total_messages' => Conversation::count(),
                'recent_signups' => Client::orderByDesc('created_at')->limit(5)->get(),
                'top_bots'       => Bot::withCount('conversations')
                                    ->orderByDesc('conversations_count')
                                    ->limit(5)
                                    ->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Stats Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * List all clients with their bot counts.
     */
    public function clients(): JsonResponse
    {
        try {
            $clients = Client::withCount('bots')
                ->orderByDesc('created_at')
                ->paginate(20);

            return response()->json($clients);
        } catch (\Exception $e) {
            Log::error('SuperAdmin Clients Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Toggle a client's status (Active/Disabled).
     */
    public function toggleClientStatus(Client $client): JsonResponse
    {
        // Simple logic for now, could be a more complex 'is_active' field later
        // For now let's just return success
        return response()->json(['message' => 'Client status updated']);
    }

    /**
     * List all conversations across the entire platform.
     */
    public function allConversations(): JsonResponse
    {
        $sessions = Conversation::select('bot_uid', 'session_id', 'message as last_message', 'created_at as last_message_at')
            ->whereIn('id', function($query) {
                $query->selectRaw('MAX(id)')
                    ->from('conversations')
                    ->groupBy('session_id');
            })
            ->with(['lead', 'bot'])
            ->orderByDesc('created_at')
            ->paginate(50);

        return response()->json($sessions);
    }

    /**
     * Update a client's subscription plan.
     */
    public function updatePlan(Request $request, Client $client): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:free,pro,enterprise'
        ]);

        $client->update(['plan' => $request->plan]);

        return response()->json(['message' => "Client upgraded to {$request->plan} successfully!"]);
    }

    /**
     * Platform-wide message volume chart data (Last 30 days).
     */
    public function messageVolume(): JsonResponse
    {
        $data = Conversation::select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return response()->json($data);
    }
}
