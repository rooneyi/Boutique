<?php

use App\Models\Customer;
use App\Models\User;
use App\Notifications\PasswordResetOtpNotification;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::resetPasswords());
});

test('email verification step redirects to otp confirm page', function () {
    Notification::fake();

    $user = User::factory()->create([
        'role' => 'CUSTOMER',
        'email' => 'otp-client@example.com',
    ]);

    Customer::create(['user_id' => $user->id, 'phone' => '+33600000001']);

    $response = $this->post(route('auth.forgot-password.store'), [
        'email' => $user->email,
    ]);

    $response->assertRedirect(route('auth.forgot-password.verify'));
    Notification::assertSentTo($user, PasswordResetOtpNotification::class);
});

test('otp can be verified and redirects to reset password form', function () {
    Notification::fake();

    $user = User::factory()->create([
        'role' => 'CUSTOMER',
        'email' => 'otp-verify@example.com',
    ]);

    $this->post(route('auth.forgot-password.store'), ['email' => $user->email]);

    $notification = Notification::sent($user, PasswordResetOtpNotification::class)->first();
    $code = $notification->code;

    $response = $this->post(route('auth.forgot-password.verify.store'), [
        'code' => $code,
    ]);

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toContain('reset-password');
});
