import { Form, Head, Link } from '@inertiajs/react';
import GoogleIcon from '@/components/icons/google-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { cn } from '@/lib/utils';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

const inputClassName =
    'h-12 rounded-xl border-neutral-300 bg-white px-4 text-base text-black placeholder:text-neutral-400 focus-visible:border-black focus-visible:ring-black/20';

const linkClassName = 'text-sm font-normal text-[#e53935] no-underline hover:text-[#c62828]';

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Connexion" />

            <div className="space-y-8">
                <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
                        Connecte-toi à ton style
                    </h1>
                    <p className="text-sm text-neutral-600 sm:text-base">
                        Bienvenue chez POSE COMME JAMAIS
                    </p>
                </div>

                {status && (
                    <div className="text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="space-y-5"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="space-y-4">
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
                                        className={inputClassName}
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
                                        className={inputClassName}
                                    />
                                    {canResetPassword && (
                                        <div className="flex justify-end pt-1">
                                            <TextLink
                                                href={request()}
                                                className={linkClassName}
                                                tabIndex={5}
                                            >
                                                Mot de passe oublié ?
                                            </TextLink>
                                        </div>
                                    )}
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    className="h-12 w-full rounded-xl bg-black text-sm font-semibold tracking-wide text-white uppercase hover:bg-neutral-800"
                                    tabIndex={3}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner />}
                                    SE CONNECTER
                                </Button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-px flex-1 bg-neutral-200" />
                                <span className="text-sm text-neutral-400">
                                    — ou —
                                </span>
                                <div className="h-px flex-1 bg-neutral-200" />
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 w-full rounded-xl border-neutral-300 bg-white text-sm font-normal text-black normal-case hover:bg-neutral-50"
                                tabIndex={4}
                            >
                                <span className="flex-1 text-center lowercase">
                                    se connecter avec google
                                </span>
                                <GoogleIcon className="size-5 shrink-0" />
                            </Button>

                            {canRegister && (
                                <p className="text-center text-sm text-neutral-600">
                                    vous n&apos;avez pas de compte ?{' '}
                                    <Link
                                        href={route('auth.customer.register')}
                                        className={cn(
                                            linkClassName,
                                            'font-semibold',
                                        )}
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
