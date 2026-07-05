export const DEFAULT_PHONE_DIAL = '+243';

export const PHONE_COUNTRIES = [
    { code: 'CD', dial: '+243', label: 'RDC' },
    { code: 'CG', dial: '+242', label: 'Congo' },
    { code: 'AO', dial: '+244', label: 'Angola' },
    { code: 'ZM', dial: '+260', label: 'Zambie' },
    { code: 'TZ', dial: '+255', label: 'Tanzanie' },
    { code: 'RW', dial: '+250', label: 'Rwanda' },
    { code: 'BI', dial: '+257', label: 'Burundi' },
    { code: 'FR', dial: '+33', label: 'France' },
    { code: 'BE', dial: '+32', label: 'Belgique' },
] as const;

export function sanitizeNationalDigits(raw: string): string {
    const digits = raw.replace(/\D/g, '');

    if (digits.startsWith('0')) {
        return digits.slice(0, 10);
    }

    return digits.slice(0, 9);
}

export function buildFullPhone(dial: string, national: string): string | null {
    let digits = national.replace(/\D/g, '');

    if (digits === '') {
        return null;
    }

    if (digits.startsWith('0')) {
        if (digits.length !== 10) {
            return null;
        }
        digits = digits.slice(1);
    } else if (digits.length !== 9) {
        return null;
    }

    const dialDigits = dial.replace(/\D/g, '');

    if (dialDigits === '') {
        return null;
    }

    return `+${dialDigits}${digits}`;
}

export function parseFullPhone(
    full: string | null | undefined,
): { dial: string; national: string } {
    if (!full?.trim()) {
        return { dial: DEFAULT_PHONE_DIAL, national: '' };
    }

    const cleaned = full.replace(/\s/g, '');

    for (const country of PHONE_COUNTRIES) {
        const dialDigits = country.dial.replace(/\D/g, '');
        const pattern = new RegExp(`^\\+?${dialDigits}(\\d+)$`);

        if (pattern.test(cleaned)) {
            let national = cleaned.replace(new RegExp(`^\\+?${dialDigits}`), '');

            if (country.dial === DEFAULT_PHONE_DIAL && national.length === 9) {
                national = `0${national}`;
            }

            return { dial: country.dial, national };
        }
    }

    return {
        dial: DEFAULT_PHONE_DIAL,
        national: cleaned.replace(/\D/g, ''),
    };
}

export function isValidFullPhone(full: string): boolean {
    const trimmed = full.trim().replace(/\s/g, '');

    if (trimmed === '') {
        return false;
    }

    const { dial, national } = parseFullPhone(trimmed);
    const built = buildFullPhone(dial, national);

    return built !== null && built === trimmed;
}
