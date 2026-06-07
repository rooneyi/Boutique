import { Form, Head, Link } from '@inertiajs/react';
import GoogleIcon from '@/components/icons/google-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_GOOGLE,
    AUTH_BTN_PRIMARY,
    AUTH_DIVIDER_LABEL,
    AUTH_DIVIDER_LINE,
    AUTH_DIVIDER_ROW,
    AUTH_GOOGLE_LINK,
    AUTH_INPUT,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';
import { store } from '@/routes/login';

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
                    <p className="text-center text-sm font-medium text-green-600">
                        {status}
                    </p>
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
                                        href={route('auth.forgot-password')}
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
                                    {processing && (
                                        <Spinner className="text-white" />
                                    )}
                                    SE CONNECTER
                                </Button>
                            </div>

                            <div className={AUTH_DIVIDER_ROW} aria-hidden={false}>
                                <span className={AUTH_DIVIDER_LINE} />
                                <span className={AUTH_DIVIDER_LABEL}>ou</span>
                                <span className={AUTH_DIVIDER_LINE} />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className={AUTH_BTN_GOOGLE}
                                tabIndex={4}
                                asChild
                            >
                                <a
                                    href={route('auth.google.redirect')}
                                    className={AUTH_GOOGLE_LINK}
                                >
                                    <span className="flex-1 text-center">
                                        se connecter avec google
                                    </span>
                                    <GoogleIcon className="size-[26px] shrink-0" />
                                </a>
                            </Button>

                            {canRegister && (
                                <p className="text-center font-poppins text-xs text-[#484848]">
                                    vous n&apos;avez pas de compte ?{' '}
                                    <Link
                                        href={route('auth.customer.register')}
                                        className={AUTH_LINK_RED}
                                        tabIndex={6}
                                    >
                                        inscrivez-vous
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
