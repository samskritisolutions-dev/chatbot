<?php

namespace App\Http\Controllers;

use App\Models\Bot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class BotController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $bots = $request->user()->bots()
            ->withCount('conversations')
            ->latest()
            ->get();
            
        return response()->json($bots);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'bot_name'      => 'required|string|max:100',
            'system_prompt' => 'required|string',
            'welcome_msg'   => 'nullable|string',
            'fallback_msg'  => 'nullable|string',
            'avatar_url'    => 'nullable|url',
            'logo_url'      => 'nullable|url',
            'widget_color'  => 'nullable|string|max:20',
            'font_family'   => 'nullable|string|max:100',
            'position'      => 'nullable|in:bottom-right,bottom-left',
        ]);

        $bot = $request->user()->bots()->create([
            ...$data,
            'bot_uid'      => Str::uuid(),
            'widget_color' => $data['widget_color'] ?? '#0EA5E9',
            'font_family'  => $data['font_family']  ?? 'Inter, sans-serif',
            'position'     => $data['position']     ?? 'bottom-right',
            'welcome_msg'  => $data['welcome_msg']  ?? 'Hi! How can I help you today?',
            'fallback_msg' => $data['fallback_msg'] ?? 'Sorry, I could not understand that. A human will assist you shortly.',
        ]);

        return response()->json($bot, 201);
    }

    public function show(Request $request, Bot $bot): JsonResponse
    {
        $this->authorise($request, $bot);
        return response()->json($bot);
    }



    public function update(Request $request, Bot $bot): JsonResponse
    {
        $this->authorise($request, $bot);

        $data = $request->validate([
            'bot_name'       => 'sometimes|string|max:100',
            'system_prompt'  => 'sometimes|string',
            'welcome_msg'    => 'nullable|string',
            'fallback_msg'   => 'nullable|string',
            'avatar_url'     => 'nullable|url',
            'logo_url'       => 'nullable|url',
            'widget_color'   => 'nullable|string|max:20',
            'font_family'    => 'nullable|string|max:100',
            'position'       => 'nullable|in:bottom-right,bottom-left',
            'allowed_domains'=> 'nullable|string',
            'is_active'      => 'nullable|boolean',
        ]);

        $bot->update($data);

        return response()->json($bot);
    }

    public function destroy(Request $request, Bot $bot): JsonResponse
    {
        $this->authorise($request, $bot);
        $bot->delete();
        return response()->json(['message' => 'Bot deleted']);
    }

    public function embedCode(Request $request, Bot $bot): JsonResponse
    {
        $this->authorise($request, $bot);
        $baseUrl = config('app.url');
        
        $snippet = "<!-- AI Chatbot Embed -->\n" .
                   "<script src=\"{$baseUrl}/widget.js\" data-bot-uid=\"{$bot->bot_uid}\" defer></script>\n" .
                   "<!-- End AI Chatbot Embed -->";

        return response()->json(['code' => $snippet]);
    }

    private function authorise(Request $request, Bot $bot): void
    {
        abort_if($bot->client_id !== $request->user()->id, 403, 'Unauthorized');
    }
}
