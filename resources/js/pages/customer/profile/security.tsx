import { Form, Head, Link, usePage } from '@inertiajs/react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import { FlashToaster } from '@/components/flash-toaster';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
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
import { SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { cn } from '@/lib/utils';

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
};

type PageProps = {
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerProfileSecurity() {
    const { auth, canRegister } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Mot de passe & sécurité · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <div className="mx-auto max-w-[751px] px-4 pb-16 sm:px-[18px]">
                            <Link
                                href={route('profile.edit')}
                                className={cn(AUTH_LINK_RED, 'text-sm')}
                            >
                                ← Retour au profil
                            </Link>

                            <h1
                                className={cn(
                                    SF_PAGE_TITLE,
                                    'mt-4 mb-3 text-center lg:text-left',
                                )}
                            >
                                Mot de passe & sécurité
                            </h1>
                            <p className="mb-8 text-center font-poppins text-[15px] text-[#484848] lg:text-left">
                                Choisissez un mot de passe long et unique pour
                                protéger votre compte.
                            </p>

                            <Form
                                {...SecurityController.update.form()}
                                options={{ preserveScroll: true }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess={[
                                    'current_password',
                                    'password',
                                    'password_confirmation',
                                ]}
                                className="flex flex-col gap-8"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <Input
                                                    id="current_password"
                                                    type="password"
                                                    name="current_password"
                                                    required
                                                    autoFocus
                                                    autoComplete="current-password"
                                                    placeholder="Mot de passe actuel"
                                                    disabled={processing}
                                                    className={AUTH_INPUT_UNDERLINE}
                                                />
                                                <InputError
                                                    message={errors.current_password}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    name="password"
                                                    required
                                                    autoComplete="new-password"
                                                    placeholder="Nouveau mot de passe"
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
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={cn(
                                                    AUTH_BTN_PRIMARY,
                                                    'w-full sm:w-auto sm:min-w-[200px]',
                                                )}
                                                data-test="update-password-button"
                                            >
                                                {processing && (
                                                    <Spinner className="text-white" />
                                                )}
                                                ENREGISTRER
                                            </Button>

                                            <Link
                                                href={route('auth.forgot-password')}
                                                className="text-center font-poppins text-sm text-[#737373] hover:text-black"
                                            >
                                                Mot de passe oublié ?
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </main>

                <HomeFooter />
                <FlashToaster />
            </div>
        </>
    );
}
