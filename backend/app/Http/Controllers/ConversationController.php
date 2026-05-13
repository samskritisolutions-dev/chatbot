<?php

namespace App\Http\Controllers;

use App\Models\Bot;
use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ConversationController extends Controller
{
    /**
     * List all unique sessions across all client bots.
     */
    public function index(Request $request): JsonResponse
    {
        $botUids = $request->user()->bots()->pluck('bot_uid');

        // Subquery to get the latest message for each session belonging to the client's bots
        $sessions = Conversation::whereIn('bot_uid', $botUids)
            ->select('bot_uid', 'session_id', 'message as last_message', 'created_at as last_message_at')
            ->whereIn('id', function($query) use ($botUids) {
                $query->selectRaw('MAX(id)')
                    ->from('conversations')
                    ->whereIn('bot_uid', $botUids)
                    ->groupBy('session_id');
            })
            ->with(['lead' => function($q) {
                $q->select('session_id', 'name', 'email');
            }])
            ->orderByDesc('created_at')
            ->paginate(30);

        return response()->json($sessions);
    }

    /**
     * Full message thread for a session.
     */
    public function show(Request $request, string $session): JsonResponse
    {
        // Verify this session belongs to a bot owned by the authenticated client
        $botUids = $request->user()->bots()->pluck('bot_uid');

        $messages = Conversation::whereIn('bot_uid', $botUids)
            ->where('session_id', $session)
            ->orderBy('created_at')
            ->get();

        abort_if($messages->isEmpty(), 404, 'Session not found');

        return response()->json($messages);
    }
}
