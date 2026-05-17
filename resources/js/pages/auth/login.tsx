import { Form, Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import GoogleIcon from '@/components/icons/google-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_GOOGLE,
    AUTH_BTN_PRIMARY,
    AUTH_INPUT,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Connexion" />

            <div className="flex w-full flex-col items-center gap-[54px]">
                <header className="flex w-full flex-col items-center gap-2.5 py-3 text-center">
                    <h1 className="font-poppins text-[36px] font-bold leading-tight text-[#171616]">
                        Connecte-toi à ton style
                    </h1>
                    <p className="font-poppins text-[15px] font-normal text-[#484848]">
                        Bienvenue chez POSE COMME JAMAIS
                    </p>
                </header>

                {status && (
                    <p className="text-center text-sm font-medium text-green-600">{status}</p>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-[25px] pb-2">
                                <div className="flex w-full flex-col gap-[25px]">
                                    <div className="space-y-1">
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="Email"
                                            className={AUTH_INPUT}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            placeholder="mot de passe"
                                            className={AUTH_INPUT}
                                        />
                                        <InputError message={errors.password} />
                                    </div>
                                </div>

                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className={AUTH_LINK_RED}
                                        tabIndex={5}
                                    >
                                        Mot de passe oublié ?
                                    </TextLink>
                                )}

                                <Button
                                    type="submit"
                                    className={AUTH_BTN_PRIMARY}
                                    tabIndex={3}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner className="text-white" />}
                                    SE CONNECTER
                                </Button>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className="h-px w-5 bg-[#8a8a8a]" aria-hidden />
                                <span className="font-poppins text-xs text-[#8a8a8a]">Ou</span>
                                <span className="h-px w-5 bg-[#8a8a8a]" aria-hidden />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className={AUTH_BTN_GOOGLE}
                                tabIndex={4}
                                onClick={() =>
                                    toast.message('Bientôt disponible', {
                                        description:
                                            'La connexion Google sera activée prochainement.',
                                    })
                                }
                            >
                                <span className="flex-1 text-center lowercase">
                                    se connecter avec google
                                </span>
                                <GoogleIcon className="size-[26px] shrink-0" />
                            </Button>

                            {canRegister && (
                                <p className="text-center font-poppins text-xs text-[#484848]">
                                    Vous n&apos;avez pas de compte ?{' '}
                                    <Link
                                        href={route('auth.customer.register')}
                                        className={AUTH_LINK_RED}
                                        tabIndex={6}
                                    >
                                        Inscrivez-vous
                                    </Link>
                                </p>
                            )}
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

Login.layout = {
    variant: 'split',
};
