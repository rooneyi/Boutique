import { Form, Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import InputError from '@/components/input-error';
import {
    PASSWORD_RESET_OTP_LENGTH,
    PasswordResetOtpInput,
} from '@/components/auth/password-reset-otp-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_PRIMARY,
    AUTH_LINK_MUTED,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';

type Props = {
    resendAvailableAt: number;
    identifier: string;
    channel: 'email' | 'phone';
    status?: string;
};

function formatCountdown(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function ForgotPasswordVerify({
    resendAvailableAt,
    status,
}: Props) {
    const [code, setCode] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(() =>
        Math.max(0, resendAvailableAt - Math.floor(Date.now() / 1000)),
    );

    useEffect(() => {
        const tick = () => {
            setSecondsLeft(
                Math.max(0, resendAvailableAt - Math.floor(Date.now() / 1000)),
            );
        };

        tick();
        const interval = window.setInterval(tick, 1000);

        return () => window.clearInterval(interval);
    }, [resendAvailableAt]);

    const canResend = secondsLeft <= 0;

    const handleResend = () => {
        if (!canResend) {
            return;
        }

        router.post(route('auth.forgot-password.verify.resend'), {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Confirmer l'OTP · PCJ" />

            <div className="flex w-full flex-col items-center gap-[54px]">
                <header className="flex w-full flex-col items-center gap-2.5 py-3 text-center">
                    <h1 className="font-poppins text-[36px] font-bold leading-tight text-[#171616]">
                        Confirmez l&apos;OTP
                    </h1>
                    <p className="font-poppins text-[15px] font-normal text-[#484848]">
                        Nous avons envoyé un OTP à l&apos;identifiant renseigné
                    </p>
                </header>

                {status && (
                    <p className="text-center font-poppins text-sm font-medium text-green-600">
                        {status}
                    </p>
                )}

                <Form
                    method="post"
                    action={route('auth.forgot-password.verify.store')}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-10 pb-2">
                                <div className="flex w-full flex-col items-center gap-2">
                                    <PasswordResetOtpInput
                                        value={code}
                                        onChange={setCode}
                                        disabled={processing}
                                    />
                                    <InputError message={errors.code} />
                                </div>

                                <Button
                                    type="submit"
                                    className={AUTH_BTN_PRIMARY}
                                    disabled={
                                        processing ||
                                        code.length < PASSWORD_RESET_OTP_LENGTH
                                    }
                                >
                                    {processing && <Spinner className="text-white" />}
                                    VERIFICATION
                                </Button>

                                <p className="w-full text-center">
                                    {canResend ? (
                                        <button
                                            type="button"
                                            onClick={handleResend}
                                            className={`${AUTH_LINK_MUTED} cursor-pointer bg-transparent p-0`}
                                        >
                                            Renvoyer l&apos;OTP
                                        </button>
                                    ) : (
                                        <span className={AUTH_LINK_MUTED}>
                                            Renvoyer l&apos;OTP dans{' '}
                                            {formatCountdown(secondsLeft)}
                                        </span>
                                    )}
                                </p>
                            </div>

                            <p className="text-center font-poppins text-xs text-[#484848]">
                                Vous avez déjà un compte ?{' '}
                                <Link href={route('login')} className={AUTH_LINK_RED}>
                                    Connectez-vous
                                </Link>
                            </p>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

ForgotPasswordVerify.layout = {
    variant: 'split',
};
