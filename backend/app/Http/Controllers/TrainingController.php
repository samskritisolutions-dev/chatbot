<?php

namespace App\Http\Controllers;

use App\Models\Source;
use App\Models\Bot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class TrainingController extends Controller
{
    /**
     * List all sources for a client's bots.
     */
    public function index(Request $request): JsonResponse
    {
        $botUids = $request->user()->bots()->pluck('bot_uid');
        $sources = Source::whereIn('bot_uid', $botUids)->latest()->get();
        return response()->json($sources);
    }

    /**
     * Handle file upload.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'bot_uid' => 'required|exists:bots,bot_uid',
            'file'    => 'required|file|mimes:pdf,docx,txt|max:10240',
        ]);

        $botUid = $request->input('bot_uid');
        $file   = $request->file('file');
        
        $path = $file->store("training/{$botUid}", 'public');

        $source = Source::create([
            'bot_uid'   => $botUid,
            'type'      => 'file',
            'name'      => $file->getClientOriginalName(),
            'file_path' => $path,
            'status'    => 'ready', // Usually 'training' until chunked
        ]);

        return response()->json($source);
    }

    /**
     * Handle URL import with real crawling.
     */
    public function importUrl(Request $request): JsonResponse
    {
        $request->validate([
            'bot_uid' => 'required|exists:bots,bot_uid',
            'url'     => 'required|url',
        ]);

        $url = $request->input('url');
        $botUid = $request->input('bot_uid');

        try {
            // 1. Fetch content
            $html = @file_get_contents($url);
            if (!$html) {
                throw new \Exception("Could not reach the URL: $url");
            }

            // 2. Clean content
            // Remove scripts and styles
            $text = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $html);
            $text = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $text);
            
            // Strip tags and decode entities
            $text = strip_tags($text);
            $text = html_entity_decode($text);
            
            // Remove extra whitespace
            $text = preg_replace('/\s+/', ' ', $text);
            $text = trim($text);

            if (empty($text)) {
                throw new \Exception("The page at $url appears to have no readable text.");
            }

            // 3. Create source
            $source = Source::create([
                'bot_uid' => $botUid,
                'type'    => 'url',
                'name'    => $url,
                'content' => $text,
                'status'  => 'ready',
            ]);

            return response()->json($source);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Handle manual text import.
     */
    public function importText(Request $request): JsonResponse
    {
        $request->validate([
            'bot_uid' => 'required|exists:bots,bot_uid',
            'name'    => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $source = Source::create([
            'bot_uid' => $request->input('bot_uid'),
            'type'    => 'text',
            'name'    => $request->input('name'),
            'content' => $request->input('content'),
            'status'  => 'ready',
        ]);

        return response()->json($source);
    }

    /**
     * Delete a source.
     */
    public function destroy(int $id): JsonResponse
    {
        $source = Source::findOrFail($id);
        
        if ($source->file_path) {
            Storage::disk('public')->delete($source->file_path);
        }

        $source->delete();

        return response()->json(['message' => 'Source deleted']);
    }
}
