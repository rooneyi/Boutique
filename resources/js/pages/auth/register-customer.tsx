import { Form, Head, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import GoogleIcon from '@/components/icons/google-icon';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_GOOGLE,
    AUTH_BTN_PRIMARY,
    AUTH_INPUT_UNDERLINE,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';

export default function RegisterCustomer() {
    return (
        <>
            <Head title="Créer un compte · PCJ" />

            <div className="flex w-full flex-col items-center gap-[54px]">
                <header className="flex w-full flex-col items-center gap-2.5 py-3 text-center">
                    <h1 className="font-poppins text-[36px] font-bold leading-tight text-[#171616]">
                        Créez un compte
                    </h1>
                    <p className="font-poppins text-[15px] font-normal text-[#484848]">
                        Bienvenue chez POSE COMME JAMAIS
                    </p>
                </header>

                <Form
                    method="post"
                    action={route('auth.customer.register.store')}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-[60px] pb-2">
                                <div className="flex w-full flex-col gap-[25px]">
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="space-y-1">
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                type="text"
                                                placeholder="Prénom"
                                                required
                                                autoFocus
                                                disabled={processing}
                                                className={AUTH_INPUT_UNDERLINE}
                                                autoComplete="given-name"
                                            />
                                            <InputError message={errors.first_name} />
                                        </div>
                                        <div className="space-y-1">
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                type="text"
                                                placeholder="Postnom"
                                                required
                                                disabled={processing}
                                                className={AUTH_INPUT_UNDERLINE}
                                                autoComplete="family-name"
                                            />
                                            <InputError message={errors.last_name} />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            required
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                            autoComplete="email"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="Téléphone"
                                            required
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                            autoComplete="tel"
                                        />
                                        <InputError message={errors.phone} />
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="Mot de passe"
                                            required
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                            autoComplete="new-password"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-1">
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            placeholder="Confirmer le mot de passe"
                                            required
                                            disabled={processing}
                                            className={AUTH_INPUT_UNDERLINE}
                                            autoComplete="new-password"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className={AUTH_BTN_PRIMARY}
                                    disabled={processing}
                                >
                                    {processing && <Spinner className="text-white" />}
                                    SUIVANT
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
                                onClick={() =>
                                    toast.message('Bientôt disponible', {
                                        description:
                                            'L’inscription Google sera activée prochainement.',
                                    })
                                }
                            >
                                <span className="flex-1 text-center">
                                    Se connecter avec Google
                                </span>
                                <GoogleIcon className="size-[26px] shrink-0" />
                            </Button>

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

RegisterCustomer.layout = {
    variant: 'split',
};
