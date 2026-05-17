<?php

namespace App\Services;

use App\Models\PasswordResetOtp;
use App\Models\User;
use App\Notifications\PasswordResetOtpNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetOtpService
{
    public const OTP_LENGTH = 6;

    public const OTP_TTL_MINUTES = 10;

    public const RESEND_COOLDOWN_SECONDS = 60;

    public function send(User $user): string
    {
        PasswordResetOtp::query()
            ->where('email', $user->email)
            ->delete();

        $plainCode = Str::padLeft((string) random_int(0, 999_999), self::OTP_LENGTH, '0');

        PasswordResetOtp::create([
            'email' => $user->email,
            'code' => Hash::make($plainCode),
            'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES),
        ]);

        $user->notify(new PasswordResetOtpNotification($plainCode));

        return $plainCode;
    }

    public function verify(string $email, string $code): bool
    {
        $otp = PasswordResetOtp::query()
            ->where('email', $email)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (! $otp || ! Hash::check($code, $otp->code)) {
            return false;
        }

        PasswordResetOtp::query()->where('email', $email)->delete();

        return true;
    }
}
