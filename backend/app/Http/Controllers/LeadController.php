<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();

        // Get leads for all bots belonging to the authenticated user
        $botUids = $user->bots()->pluck('bot_uid');
        $leads = Lead::whereIn('bot_uid', $botUids)
        ->orderBy('created_at', 'DESC')
        ->paginate(20);

            return response()->json($leads);
        } catch (\Exception $e) {
            \Log::error('Lead Fetch Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $lead = Lead::findOrFail($id);
        $lead->delete();
        return response()->json(['message' => 'Lead deleted']);
    }
}
