<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirectToGoogle()
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()
        ]);
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $client = Client::where('email', $googleUser->getEmail())->first();

            if (!$client) {
                $client = Client::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'password' => bcrypt(bin2hex(random_bytes(8))), // Random password
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            } else {
                // Update google_id if not set
                if (!$client->google_id) {
                    $client->update(['google_id' => $googleUser->getId()]);
                }
            }

            $token = $client->createToken('auth_token')->plainTextToken;

            // Redirect back to frontend with token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away($frontendUrl . '/login?token=' . $token);

        } catch (Exception $e) {
            return redirect()->away(env('FRONTEND_URL', 'http://localhost:3000') . '/login?error=google_failed');
        }
    }
}
