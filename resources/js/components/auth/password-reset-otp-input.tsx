import { REGEXP_ONLY_DIGITS } from 'input-otp';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from '@/components/ui/input-otp';
import { AUTH_OTP_GROUP, AUTH_OTP_SLOT } from '@/lib/auth-ui-styles';

const OTP_LENGTH = 6;

type Props = {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    name?: string;
};

export function PasswordResetOtpInput({
    value,
    onChange,
    disabled,
    name = 'code',
}: Props) {
    return (
        <InputOTP
            name={name}
            maxLength={OTP_LENGTH}
            value={value}
            onChange={onChange}
            disabled={disabled}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoFocus
        >
            <InputOTPGroup className={AUTH_OTP_GROUP}>
                {Array.from({ length: OTP_LENGTH }, (_, index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                        className={AUTH_OTP_SLOT}
                    />
                ))}
            </InputOTPGroup>
        </InputOTP>
    );
}

export const PASSWORD_RESET_OTP_LENGTH = OTP_LENGTH;
