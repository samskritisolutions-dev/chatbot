<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AgentController extends Controller
{
    /**
     * Mark a session as human-controlled.
     */
    public function takeover(string $session): JsonResponse
    {
        // In a real app, you'd store 'is_human_controlled' in a Session or Bot table.
        // For now, we'll just log it.
        
        return response()->json([
            'message' => 'Human agent has taken over the conversation.',
            'session' => $session
        ]);
    }

    /**
     * Send a message from a support agent to the visitor.
     */
    public function reply(Request $request, string $session): JsonResponse
    {
        $request->validate([
            'message' => 'required|string',
            'bot_uid' => 'required'
        ]);

        $reply = Conversation::create([
            'bot_uid'    => $request->bot_uid,
            'session_id' => $session,
            'role'       => 'assistant', // Shows up as the bot/company
            'message'    => $request->message,
        ]);

        // In a real app, you'd broadcast this via Pusher so the visitor sees it instantly.
        // broadcast(new NewMessage($request->bot_uid, $session, 'assistant', $request->message));

        return response()->json($reply);
    }
}
