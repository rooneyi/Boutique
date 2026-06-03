<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function redirect(Request $request): RedirectResponse
    {
        $clientId = (string) config('services.google.client_id');
        $redirectUri = (string) config('services.google.redirect');

        abort_if($clientId === '' || $redirectUri === '', 503, 'Google OAuth non configuré.');

        $state = Str::random(40);
        $request->session()->put('google_oauth_state', $state);

        $query = http_build_query([
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'online',
            'prompt' => 'select_account',
            'state' => $state,
        ]);

        return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?'.$query);
    }

    public function callback(Request $request): RedirectResponse
    {
        $expectedState = (string) $request->session()->pull('google_oauth_state', '');
        $receivedState = (string) $request->query('state', '');

        if ($expectedState === '' || ! hash_equals($expectedState, $receivedState)) {
            return redirect()->route('login')->withErrors([
                'email' => 'Session Google invalide. Veuillez réessayer.',
            ]);
        }

        $code = (string) $request->query('code', '');
        if ($code === '') {
            return redirect()->route('login')->withErrors([
                'email' => 'Connexion Google annulée.',
            ]);
        }

        $tokenResponse = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri' => config('services.google.redirect'),
            'grant_type' => 'authorization_code',
        ]);

        if (! $tokenResponse->successful()) {
            return redirect()->route('login')->withErrors([
                'email' => 'Impossible de finaliser la connexion Google.',
            ]);
        }

        $accessToken = (string) $tokenResponse->json('access_token', '');
        if ($accessToken === '') {
            return redirect()->route('login')->withErrors([
                'email' => 'Jeton Google invalide.',
            ]);
        }

        $profileResponse = Http::withToken($accessToken)
            ->get('https://www.googleapis.com/oauth2/v3/userinfo');

        if (! $profileResponse->successful()) {
            return redirect()->route('login')->withErrors([
                'email' => 'Impossible de récupérer votre profil Google.',
            ]);
        }

        $email = (string) $profileResponse->json('email', '');
        $name = trim((string) $profileResponse->json('name', ''));
        $emailVerified = (bool) $profileResponse->json('email_verified', false);

        if ($email === '' || ! $emailVerified) {
            return redirect()->route('login')->withErrors([
                'email' => 'Le compte Google doit avoir un email vérifié.',
            ]);
        }

        $user = DB::transaction(function () use ($email, $name) {
            /** @var User|null $user */
            $user = User::query()->where('email', $email)->first();

            if (! $user) {
                $user = User::query()->create([
                    'name' => $name !== '' ? $name : Str::before($email, '@'),
                    'email' => $email,
                    'password' => Str::random(64),
                    'role' => 'CUSTOMER',
                    'email_verified_at' => now(),
                ]);
            } elseif ($user->email_verified_at === null) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }

            if ($user->role === 'CUSTOMER' && ! $user->customer) {
                Customer::query()->create([
                    'user_id' => $user->id,
                ]);
            }

            return $user;
        });

        auth()->login($user, true);
        $request->session()->regenerate();

        return redirect()->route('home');
    }
}
