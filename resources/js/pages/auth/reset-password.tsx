import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_PRIMARY,
    AUTH_INPUT_UNDERLINE,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
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
                        Choisissez un nouveau mot de passe pour votre compte
                    </p>
                </header>

                <Form
                    {...update.form()}
                    transform={(data) => ({ ...data, token, email })}
                    resetOnSuccess={['password', 'password_confirmation']}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-[60px] pb-2">
                                <div className="flex w-full flex-col gap-[25px]">
                                    <div className="space-y-1">
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            autoFocus
                                            autoComplete="new-password"
                                            placeholder="Mot de passe"
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            required
                                            autoComplete="new-password"
                                            placeholder="Confirmer le mot de passe"
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                        />
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className={AUTH_BTN_PRIMARY}
                                    disabled={processing}
                                    data-test="reset-password-button"
                                >
                                    {processing && (
                                        <Spinner className="text-white" />
                                    )}
                                    ENREGISTRER
                                </Button>
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

ResetPassword.layout = {
    variant: 'split',
};
