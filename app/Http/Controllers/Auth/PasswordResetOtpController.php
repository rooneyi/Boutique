<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\User;
use App\Services\PasswordResetOtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetOtpController extends Controller
{
    public function __construct(
        private PasswordResetOtpService $otpService,
    ) {}

    public function sendEmail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email'],
        ]);

        $user = User::query()->where('email', $validated['email'])->first();

        if (! $user) {
            return back()->withErrors([
                'email' => 'Aucun compte associé à cette adresse email.',
            ]);
        }

        $this->startFlow($request, $user, 'email', $validated['email']);

        return redirect()->route('auth.forgot-password.verify');
    }

    public function sendPhone(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'max:50'],
        ]);

        $customer = Customer::query()
            ->where('phone', $validated['phone'])
            ->with('user')
            ->first();

        if (! $customer?->user) {
            return back()->withErrors([
                'phone' => 'Aucun compte associé à ce numéro.',
            ]);
        }

        $this->startFlow($request, $customer->user, 'phone', $validated['phone']);

        return redirect()->route('auth.forgot-password.verify');
    }

    public function showVerify(Request $request): Response|RedirectResponse
    {
        if (! $request->session()->has('password_reset')) {
            return redirect()->route('password.request');
        }

        $flow = $request->session()->get('password_reset');
        $resendAvailableAt = (int) ($flow['resend_available_at'] ?? now()->timestamp);

        return Inertia::render('auth/forgot-password-verify', [
            'resendAvailableAt' => $resendAvailableAt,
            'identifier' => $flow['identifier'] ?? '',
            'channel' => $flow['channel'] ?? 'email',
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $flow = $request->session()->get('password_reset');

        if (! is_array($flow) || empty($flow['email'])) {
            return redirect()->route('password.request');
        }

        $validated = $request->validate([
            'code' => ['required', 'string', 'size:'.PasswordResetOtpService::OTP_LENGTH],
        ]);

        if (! $this->otpService->verify($flow['email'], $validated['code'])) {
            return back()->withErrors([
                'code' => 'Code invalide ou expiré.',
            ]);
        }

        $user = User::query()->where('email', $flow['email'])->firstOrFail();
        $token = Password::createToken($user);

        $request->session()->forget('password_reset');

        return redirect()->route('password.reset', [
            'token' => $token,
            'email' => $user->email,
        ]);
    }

    public function resend(Request $request): RedirectResponse
    {
        $flow = $request->session()->get('password_reset');

        if (! is_array($flow) || empty($flow['email'])) {
            return redirect()->route('password.request');
        }

        $resendAvailableAt = (int) ($flow['resend_available_at'] ?? 0);

        if (now()->timestamp < $resendAvailableAt) {
            return back()->withErrors([
                'code' => 'Veuillez patienter avant de renvoyer un code.',
            ]);
        }

        $user = User::query()->where('email', $flow['email'])->firstOrFail();
        $this->otpService->send($user);

        $flow['resend_available_at'] = now()
            ->addSeconds(PasswordResetOtpService::RESEND_COOLDOWN_SECONDS)
            ->timestamp;

        $request->session()->put('password_reset', $flow);

        return back()->with('status', 'Un nouveau code a été envoyé.');
    }

    private function startFlow(Request $request, User $user, string $channel, string $identifier): void
    {
        $this->otpService->send($user);

        $request->session()->put('password_reset', [
            'email' => $user->email,
            'channel' => $channel,
            'identifier' => $identifier,
            'resend_available_at' => now()
                ->addSeconds(PasswordResetOtpService::RESEND_COOLDOWN_SECONDS)
                ->timestamp,
        ]);
    }
}
