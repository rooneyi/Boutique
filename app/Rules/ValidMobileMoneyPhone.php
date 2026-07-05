<?php

namespace App\Rules;

use App\Support\PhoneNumber;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidMobileMoneyPhone implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || trim($value) === '') {
            return;
        }

        $provider = request()->input('payment_provider');

        if (! in_array($provider, ['airtel', 'orange', 'mpesa'], true)) {
            if (! PhoneNumber::isValidE164($value)) {
                $fail('Le numéro doit contenir 9 chiffres après l’indicatif, ou 10 chiffres en commençant par 0.');
            }

            return;
        }

        if (! PhoneNumber::isValidE164($value)) {
            $fail('Le numéro doit contenir 9 chiffres après l’indicatif, ou 10 chiffres en commençant par 0.');

            return;
        }

        if (! PhoneNumber::matchesMobileMoneyProvider($value, $provider)) {
            $fail(PhoneNumber::mobileMoneyPrefixMessage($provider));
        }
    }
}
