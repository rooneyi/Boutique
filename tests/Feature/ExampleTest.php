<?php

use App\Models\Customer;
use App\Models\User;

test('guests are redirected to login when visiting the storefront', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});

test('authenticated customers can visit the storefront home', function () {
    $user = User::factory()->create(['role' => 'CUSTOMER']);
    Customer::create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('home'));

    $response->assertOk();
});
