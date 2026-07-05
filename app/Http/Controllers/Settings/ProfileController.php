<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Support\PhoneNumber;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();

        if ($user->role === 'CUSTOMER') {
            $user->loadMissing('customer');

            return Inertia::render('customer/profile/edit', [
                'profile' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->customer?->phone,
                    'avatar_url' => $user->avatar_url,
                    'initials' => $this->initials($user->name),
                ],
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => $request->session()->get('status'),
                'canRegister' => Features::enabled(Features::registration()),
            ]);
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->safe()->only(['name', 'email']);

        $user->fill($validated);

        if ($request->boolean('remove_avatar') && $user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->avatar_path = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $user->avatar_path = $request->file('avatar')->store('avatars', 'public');
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($user->role === 'CUSTOMER') {
            $user->loadMissing('customer');
            $phone = $request->validated('phone');
            $user->customer?->update([
                'phone' => $phone !== null && $phone !== ''
                    ? PhoneNumber::normalizeE164($phone)
                    : null,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Profil mis à jour.']);

        return to_route('profile.edit');
    }

    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function initials(string $name): string
    {
        $parts = preg_split('/\s+/', trim($name)) ?: [];

        return strtoupper(
            collect($parts)
                ->take(2)
                ->map(fn (string $part) => mb_substr($part, 0, 1))
                ->join('')
        ) ?: '?';
    }
}
