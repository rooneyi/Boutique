<?php

namespace App\Support;

class PhoneNumber
{
    public const DEFAULT_DIAL = '+243';

    /**
     * @return list<array{code: string, dial: string, label: string}>
     */
    public static function countries(): array
    {
        return [
            ['code' => 'CD', 'dial' => '+243', 'label' => 'RDC'],
            ['code' => 'CG', 'dial' => '+242', 'label' => 'Congo'],
            ['code' => 'AO', 'dial' => '+244', 'label' => 'Angola'],
            ['code' => 'ZM', 'dial' => '+260', 'label' => 'Zambie'],
            ['code' => 'TZ', 'dial' => '+255', 'label' => 'Tanzanie'],
            ['code' => 'RW', 'dial' => '+250', 'label' => 'Rwanda'],
            ['code' => 'BI', 'dial' => '+257', 'label' => 'Burundi'],
            ['code' => 'FR', 'dial' => '+33', 'label' => 'France'],
            ['code' => 'BE', 'dial' => '+32', 'label' => 'Belgique'],
        ];
    }

    public static function normalize(?string $dialCode, ?string $national): ?string
    {
        if ($national === null || trim($national) === '') {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $national) ?? '';

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '0')) {
            if (strlen($digits) !== 10) {
                return null;
            }
            $digits = substr($digits, 1);
        } elseif (strlen($digits) !== 9) {
            return null;
        }

        $dialDigits = preg_replace('/\D+/', '', (string) ($dialCode ?: self::DEFAULT_DIAL)) ?? '';

        if ($dialDigits === '') {
            return null;
        }

        return '+'.$dialDigits.$digits;
    }

    public static function normalizeE164(?string $phone): ?string
    {
        if ($phone === null || trim($phone) === '') {
            return null;
        }

        $phone = preg_replace('/\s+/', '', trim($phone)) ?? '';

        if (str_starts_with($phone, '+')) {
            $digits = preg_replace('/\D+/', '', $phone) ?? '';

            if ($digits === '' || ! self::isValidE164Digits($digits)) {
                return null;
            }

            return '+'.$digits;
        }

        return self::normalize(self::DEFAULT_DIAL, $phone);
    }

    public static function isValidE164(?string $phone): bool
    {
        return self::normalizeE164($phone) !== null;
    }

    /**
     * @return array{dial: string, national: string}
     */
    public static function parse(?string $phone): array
    {
        if ($phone === null || trim($phone) === '') {
            return ['dial' => self::DEFAULT_DIAL, 'national' => ''];
        }

        $cleaned = preg_replace('/\s+/', '', trim($phone)) ?? '';

        foreach (self::countries() as $country) {
            $dialDigits = ltrim($country['dial'], '+');

            if (preg_match('/^\+?'.preg_quote($dialDigits, '/').'(\d+)$/', $cleaned, $matches) === 1) {
                $national = $matches[1];

                if ($country['dial'] === self::DEFAULT_DIAL && strlen($national) === 9) {
                    $national = '0'.$national;
                }

                return ['dial' => $country['dial'], 'national' => $national];
            }
        }

        return [
            'dial' => self::DEFAULT_DIAL,
            'national' => preg_replace('/\D+/', '', $cleaned) ?? '',
        ];
    }

    private static function isValidE164Digits(string $digits): bool
    {
        if (str_starts_with($digits, '243')) {
            return (bool) preg_match('/^243\d{9}$/', $digits);
        }

        return (bool) preg_match('/^\d{9,15}$/', $digits);
    }

    /**
     * @var array<string, list<string>>
     */
    public const MOBILE_MONEY_PREFIXES = [
        'airtel' => ['097', '098', '099'],
        'orange' => ['084', '085', '086', '089'],
        'mpesa' => ['081', '082', '083'],
    ];

    public static function matchesMobileMoneyProvider(?string $phone, string $provider): bool
    {
        if (! self::isValidE164($phone)) {
            return false;
        }

        $normalized = self::normalizeE164($phone);

        if ($normalized === null || ! str_starts_with($normalized, '+243')) {
            return false;
        }

        $national = '0'.substr($normalized, 4);
        $prefix = substr($national, 0, 3);
        $prefixes = self::MOBILE_MONEY_PREFIXES[$provider] ?? [];

        return in_array($prefix, $prefixes, true);
    }

    public static function mobileMoneyPrefixMessage(string $provider): string
    {
        $labels = [
            'airtel' => 'Airtel Money',
            'orange' => 'Orange Money',
            'mpesa' => 'M-Pesa (Vodacom)',
        ];

        $prefixes = implode(', ', self::MOBILE_MONEY_PREFIXES[$provider] ?? []);

        return sprintf(
            'Ce numéro ne correspond pas à %s. Les numéros commencent par %s.',
            $labels[$provider] ?? $provider,
            $prefixes,
        );
    }
}
