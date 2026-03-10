<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to Google's OAuth page.
     * The frontend calls this URL to start the OAuth flow.
     */
    public function redirect(Request $request)
    {
        // Accept a 'role' param so we know which role to assign on signup
        $role = in_array($request->query('role'), ['student', 'class_rep', 'lecturer'])
            ? $request->query('role')
            : 'student';

        return Socialite::driver('google')
            ->stateless()
            ->with(['state' => $role])
            ->redirect();
    }

    /**
     * Handle the Google OAuth callback.
     * Returns a Sanctum token — frontend exchanges this for session.
     */
    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Google authentication failed. Please try again.',
            ], 422);
        }

        // Determine role from state param (passed through OAuth flow)
        $role = $request->query('state', 'student');
        if (!in_array($role, ['student', 'class_rep', 'lecturer'])) {
            $role = 'student';
        }

        // Find or create the user
        $user = User::firstOrCreate(
            ['email' => $googleUser->getEmail()],
            [
                'name'              => $googleUser->getName(),
                'email'             => $googleUser->getEmail(),
                'password'          => bcrypt(\Illuminate\Support\Str::random(32)),
                'role'              => $role,
                'email_verified_at' => now(),
            ]
        );

        // Revoke old tokens and issue a fresh one
        $user->tokens()->delete();
        $token = $user->createToken('google_auth')->plainTextToken;

        // Redirect back to the frontend with the token
        $frontendUrl = config('app.frontend_url', 'http://localhost:9002');

        return redirect("{$frontendUrl}/auth/callback?token={$token}&name=" . urlencode($user->name));
    }
}
