<?php

namespace App\Http\Controllers;

use App\Models\Bot;
use App\Models\Conversation;
use App\Models\Source;
use App\Models\Lead;
use App\Events\NewMessage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use OpenAI\Laravel\Facades\OpenAI;

class ChatController extends Controller
{
    /**
     * Return bot branding config to the widget (public).
     */
    public function config(string $botUid): JsonResponse
    {
        $bot = Bot::where('bot_uid', $botUid)->where('is_active', 1)->firstOrFail();

        return response()->json([
            'bot_name'     => $bot->bot_name,
            'avatar_url'   => $bot->avatar_url,
            'logo_url'     => $bot->logo_url,
            'widget_color' => $bot->widget_color ?? '#2563eb',
            'font_family'  => $bot->font_family ?? 'Inter, sans-serif',
            'position'     => $bot->position ?? 'bottom-right',
            'welcome_msg'  => $bot->welcome_msg ?? 'Hi! How can I help you today?',
        ]);
    }

    /**
     * Accept visitor message, call OpenAI, return reply.
     */
    public function chat(Request $request, string $botUid): JsonResponse
    {
        $request->validate([
            'message'    => 'required|string',
            'session_id' => 'required|string',
            'lead'       => 'nullable|array'
        ]);

        $session = $request->input('session_id');
        $userMsg = $request->input('message');

        // 1. Fetch Bot with Client
        $bot = Bot::with('client')->where('bot_uid', $botUid)->where('is_active', 1)->firstOrFail();
        \Illuminate\Support\Facades\Log::info('New Chat Message', [
            'bot_uid' => $botUid,
            'session_id' => $session,
            'bot_found_id' => $bot->id
        ]);
        $client = $bot->client;

        // 2. Check Usage Limits (SaaS Logic)
        $limit = match($client->plan) {
            'pro'        => 5000,
            'enterprise' => 100000,
            default      => 100, // free
        };

        // Count messages sent by this client's bots in the current month
        $usage = Conversation::whereIn('bot_uid', $client->bots->pluck('bot_uid'))
            ->where('role', 'assistant')
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        if ($usage >= $limit) {
            return response()->json([
                'reply' => "This bot has reached its monthly message limit. Please upgrade the plan to continue."
            ]);
        }

        // 3. Save Lead (Tied to specific chat session for data integrity)
        if ($request->has('lead') && is_array($request->lead)) {
            $leadData = $request->lead;
            Lead::updateOrCreate(
                ['session_id' => $session, 'bot_uid' => $botUid],
                [
                    'name'  => $leadData['name'] ?? null,
                    'email' => $leadData['email'] ?? null,
                    'phone' => $leadData['phone'] ?? null,
                ]
            );
        }

        // 4. Save User Message
        Conversation::create([
            'bot_uid'    => $botUid,
            'session_id' => $session,
            'role'       => 'user',
            'message'    => $userMsg,
        ]);

        // 5. Fetch History for Context
        $history = Conversation::where('bot_uid', $botUid)
            ->where('session_id', $session)
            ->whereIn('role', ['user', 'assistant'])
            ->latest()
            ->take(15)
            ->get()
            ->reverse()
            ->map(fn ($c) => ['role' => $c->role, 'content' => $c->message])
            ->values()
            ->toArray();

        // 6. Build Knowledge Base
        $knowledge = Source::where('bot_uid', $botUid)
            ->where('status', 'ready')
            ->pluck('content')
            ->filter()
            ->implode("\n---\n");

        $systemPrompt = $bot->system_prompt;
        if (!empty($knowledge)) {
            $systemPrompt .= "\n\nUSE THE FOLLOWING KNOWLEDGE TO ANSWER QUESTIONS:\n" . $knowledge;
        }

        // 7. Call OpenAI
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ...$history,
        ];

        try {
            $response = OpenAI::chat()->create([
                'model'       => 'gpt-4o',
                'messages'    => $messages,
                'max_tokens'  => 800,
                'temperature' => 0.7,
            ]);
            $reply = $response->choices[0]->message->content;

            // 8. Save Assistant Reply
            Conversation::create([
                'bot_uid'    => $botUid,
                'session_id' => $session,
                'role'       => 'assistant',
                'message'    => $reply,
            ]);

            return response()->json(['reply' => $reply]);

        } catch (\Exception $e) {
            $error = $e->getMessage();
            Log::error('Chat Error: ' . $error);

            // Handle Quota Exceeded (Platform credits empty)
            if (str_contains(strtolower($error), 'quota') || str_contains(strtolower($error), 'insufficient')) {
                return response()->json([
                    'reply' => "I'm currently undergoing a quick neural update (Maintenance). Please check back in a few minutes!"
                ]);
            }

            return response()->json(['reply' => 'System link unstable. Please try again later.'], 500);
        }
    }

    /**
     * Return conversation history for a session (widget reload).
     */
    public function history(Request $request, string $botUid): JsonResponse
    {
        $session = $request->query('session_id');

        $messages = Conversation::where('bot_uid', $botUid)
            ->where('session_id', $session)
            ->orderBy('created_at')
            ->get(['role', 'message', 'created_at']);

        return response()->json($messages);
    }
}
