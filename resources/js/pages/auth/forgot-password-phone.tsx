import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_PRIMARY,
    AUTH_INPUT_UNDERLINE,
    AUTH_LINK_MUTED,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';

type Props = {
    status?: string;
};

export default function ForgotPasswordPhone({ status }: Props) {
    return (
        <>
            <Head title="Réinitialiser le mot de passe · PCJ" />

            <div className="flex w-full flex-col items-center gap-[54px]">
                <header className="flex w-full flex-col items-center gap-2.5 py-3 text-center">
                    <h1 className="font-poppins text-[36px] font-bold leading-tight text-[#171616]">
                        <span className="block">Réinitialisez votre mot</span>
                        <span className="block">de passe</span>
                    </h1>
                    <p className="font-poppins text-[15px] font-normal text-[#484848]">
                        Nous enverrons un OTP à l&apos;identifiant renseigné
                    </p>
                </header>

                {status && (
                    <p className="text-center font-poppins text-sm font-medium text-green-600">
                        {status}
                    </p>
                )}

                <Form
                    method="post"
                    action={route('auth.forgot-password.phone.store')}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-10 pb-2">
                                <div className="w-full space-y-1">
                                    <Input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        required
                                        autoFocus
                                        autoComplete="tel"
                                        placeholder="Numéro de téléphone"
                                        disabled={processing}
                                        className={AUTH_INPUT_UNDERLINE}
                                    />
                                    <InputError message={errors.phone} />
                                </div>

                                <Button
                                    type="submit"
                                    className={AUTH_BTN_PRIMARY}
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="text-white" />}
                                    VERIFICATION
                                </Button>

                                <p className="w-full text-center">
                                    <Link
                                        href={route('password.request')}
                                        className={AUTH_LINK_MUTED}
                                    >
                                        Utilisez votre adresse email
                                    </Link>
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

ForgotPasswordPhone.layout = {
    variant: 'split',
};
