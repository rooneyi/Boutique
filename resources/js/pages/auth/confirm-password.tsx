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
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Confirmer le mot de passe · PCJ" />

            <div className="flex w-full flex-col items-center gap-[54px]">
                <header className="flex w-full flex-col items-center gap-2.5 py-3 text-center">
                    <h1 className="font-poppins text-[36px] font-bold leading-tight text-[#171616]">
                        Confirmez votre mot de passe
                    </h1>
                    <p className="font-poppins text-[15px] font-normal text-[#484848]">
                        Cette zone est sécurisée. Veuillez confirmer votre
                        mot de passe pour continuer.
                    </p>
                </header>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <div className="flex w-full flex-col items-end gap-10 pb-2">
                            <div className="w-full space-y-1">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoFocus
                                    autoComplete="current-password"
                                    placeholder="Mot de passe"
                                    disabled={processing}
                                    className={AUTH_INPUT_UNDERLINE}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button
                                type="submit"
                                className={AUTH_BTN_PRIMARY}
                                disabled={processing}
                                data-test="confirm-password-button"
                            >
                                {processing && <Spinner className="text-white" />}
                                CONFIRMER
                            </Button>

                            <p className="w-full text-center font-poppins text-xs text-[#484848]">
                                <Link href={route('profile.edit')} className={AUTH_LINK_RED}>
                                    Retour au profil
                                </Link>
                            </p>
                        </div>
                    )}
                </Form>
            </div>
        </>
    );
}

ConfirmPassword.layout = {
    variant: 'split',
};
