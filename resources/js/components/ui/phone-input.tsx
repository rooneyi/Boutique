import { useEffect, useMemo, useRef, useState } from 'react';
import { AUTH_INPUT_UNDERLINE } from '@/lib/auth-ui-styles';
import {
    buildFullPhone,
    parseFullPhone,
    PHONE_COUNTRIES,
    sanitizeNationalDigits,
} from '@/lib/phone';
import { cn } from '@/lib/utils';

const ROUNDED_SELECT =
    'font-poppins w-[108px] shrink-0 cursor-pointer rounded-[20px] border border-[#6b7280] bg-white px-4 py-2.5 text-sm text-black focus-visible:border-black focus-visible:ring-black/10';

const ROUNDED_INPUT =
    'font-poppins w-full rounded-[20px] border border-[#6b7280] bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-black focus-visible:ring-black/10';

const ROUNDED_INPUT_ERROR =
    'font-poppins w-full rounded-[20px] border border-red-500 bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-red-500 focus-visible:ring-red-200';

type Props = {
    id?: string;
    name?: string;
    value?: string;
    onChange?: (fullPhone: string) => void;
    defaultValue?: string | null;
    required?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
    placeholder?: string;
    className?: string;
    inputClassName?: string;
    variant?: 'underline' | 'rounded';
    hasError?: boolean;
};

export function PhoneInput({
    id = 'phone',
    name = 'phone',
    value,
    onChange,
    defaultValue = null,
    required = false,
    disabled = false,
    autoFocus = false,
    placeholder = '0XX XXX XX XX',
    className,
    inputClassName,
    variant = 'underline',
    hasError = false,
}: Props) {
    const isControlled = value !== undefined && onChange !== undefined;
    const initial = useMemo(
        () => parseFullPhone(isControlled ? value : defaultValue),
        [defaultValue, isControlled, value],
    );
    const [dialCode, setDialCode] = useState(initial.dial);
    const [national, setNational] = useState(initial.national);
    const lastEmitted = useRef<string | null>(isControlled ? (value ?? '') : null);

    useEffect(() => {
        if (!isControlled) {
            return;
        }

        const external = value ?? '';

        if (external === lastEmitted.current) {
            return;
        }

        const parsed = parseFullPhone(external);
        setDialCode(parsed.dial);
        setNational(parsed.national);
        lastEmitted.current = external;
    }, [isControlled, value]);

    const fullPhone = buildFullPhone(dialCode, national) ?? '';

    const selectClass =
        variant === 'rounded'
            ? cn(ROUNDED_SELECT, hasError && 'border-red-500', inputClassName)
            : cn(AUTH_INPUT_UNDERLINE, 'w-[108px] cursor-pointer pr-1 text-sm', inputClassName);

    const inputClass =
        variant === 'rounded'
            ? cn(hasError ? ROUNDED_INPUT_ERROR : ROUNDED_INPUT, inputClassName)
            : cn(AUTH_INPUT_UNDERLINE, inputClassName);

    const emitChange = (nextDial: string, nextNational: string) => {
        setDialCode(nextDial);
        setNational(nextNational);

        if (!isControlled) {
            return;
        }

        const nextFull = buildFullPhone(nextDial, nextNational) ?? '';
        lastEmitted.current = nextFull;
        onChange(nextFull);
    };

    const handleNationalChange = (raw: string) => {
        emitChange(dialCode, sanitizeNationalDigits(raw));
    };

    const handleDialChange = (nextDial: string) => {
        emitChange(nextDial, national);
    };

    return (
        <div className={cn('flex w-full items-center gap-3', className)}>
            <div className="shrink-0">
                <label htmlFor={`${id}-country`} className="sr-only">
                    Indicatif pays
                </label>
                <select
                    id={`${id}-country`}
                    value={dialCode}
                    disabled={disabled}
                    onChange={(event) => handleDialChange(event.target.value)}
                    className={selectClass}
                    aria-label="Indicatif pays"
                >
                    {PHONE_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.dial}>
                            {country.dial} {country.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="min-w-0 flex-1">
                <input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    autoFocus={autoFocus}
                    disabled={disabled}
                    value={national}
                    placeholder={placeholder}
                    onChange={(event) => handleNationalChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (
                            event.key.length === 1 &&
                            !/[0-9]/.test(event.key) &&
                            !event.ctrlKey &&
                            !event.metaKey
                        ) {
                            event.preventDefault();
                        }
                    }}
                    onPaste={(event) => {
                        event.preventDefault();
                        handleNationalChange(event.clipboardData.getData('text'));
                    }}
                    className={inputClass}
                    aria-invalid={hasError || (required && national !== '' && fullPhone === '')}
                />
            </div>

            {!isControlled ? (
                <input type="hidden" name={name} value={fullPhone} required={required} />
            ) : null}
        </div>
    );
}
