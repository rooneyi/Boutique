import { Form, Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { FlashToaster } from '@/components/flash-toaster';
import { ProfileAvatarField } from '@/components/storefront/account/profile-avatar-field';
import { HomeFooter } from '@/components/storefront/home/home-footer';
import { HomeHeader } from '@/components/storefront/home/home-header';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
import { Spinner } from '@/components/ui/spinner';
import {
    AUTH_BTN_PRIMARY,
    AUTH_INPUT_UNDERLINE,
    AUTH_LINK_RED,
} from '@/lib/auth-ui-styles';
import { route } from '@/lib/route';
import { SF_PAGE_MAIN, SF_PAGE_TITLE } from '@/lib/storefront-ui-styles';
import { send } from '@/routes/verification';
import { cn } from '@/lib/utils';

type ProfileData = {
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string | null;
    initials: string;
};

type AuthUser = {
    id: number;
    role?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
    email_verified_at?: string | null;
};

type PageProps = {
    profile: ProfileData;
    mustVerifyEmail: boolean;
    status?: string;
    canRegister: boolean;
    auth?: { user?: AuthUser | null };
};

export default function CustomerProfileEdit() {
    const { auth, canRegister, profile, mustVerifyEmail, status } =
        usePage<PageProps>().props;
    const [removeAvatar, setRemoveAvatar] = useState(false);

    return (
        <>
            <Head title="Informations personnelles · PCJ" />

            <div className="min-h-screen bg-white font-poppins text-black antialiased">
                <HomeHeader user={auth?.user} canRegister={canRegister} />

                <main className={SF_PAGE_MAIN}>
                    <div className="mx-auto max-w-[1440px]">
                        <div className="mx-auto max-w-[751px] px-4 pb-16 sm:px-[18px]">
                            <Link
                                href={route('customer.account')}
                                className={cn(AUTH_LINK_RED, 'text-sm')}
                            >
                                ← Retour au compte
                            </Link>

                            <h1 className={cn(SF_PAGE_TITLE, 'mt-4 mb-8 text-center lg:text-left')}>
                                Informations personnelles
                            </h1>

                            <Form
                                {...ProfileController.update.form()}
                                encType="multipart/form-data"
                                options={{ preserveScroll: true }}
                                className="flex flex-col gap-8"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <ProfileAvatarField
                                            avatarUrl={profile.avatar_url}
                                            initials={profile.initials}
                                            name={profile.name}
                                            removeRequested={removeAvatar}
                                            onRemove={() => setRemoveAvatar(true)}
                                            onFileSelect={() => setRemoveAvatar(false)}
                                        />

                                        {removeAvatar ? (
                                            <input
                                                type="hidden"
                                                name="remove_avatar"
                                                value="1"
                                            />
                                        ) : null}

                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    defaultValue={profile.name}
                                                    required
                                                    autoComplete="name"
                                                    placeholder="Nom complet"
                                                    className={AUTH_INPUT_UNDERLINE}
                                                />
                                                <InputError message={errors.name} />
                                            </div>

                                            <div className="space-y-1">
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    defaultValue={profile.email}
                                                    required
                                                    autoComplete="email"
                                                    placeholder="Email"
                                                    className={AUTH_INPUT_UNDERLINE}
                                                />
                                                <InputError message={errors.email} />
                                            </div>

                                            <div className="space-y-1">
                                                <PhoneInput
                                                    id="phone"
                                                    name="phone"
                                                    defaultValue={profile.phone}
                                                    placeholder="0XX XXX XX XX"
                                                />
                                                <InputError message={errors.phone} />
                                            </div>
                                        </div>

                                        {mustVerifyEmail &&
                                        auth?.user?.email_verified_at == null ? (
                                            <p className="font-poppins text-sm text-[#737373]">
                                                Votre email n&apos;est pas vérifié.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className={AUTH_LINK_RED}
                                                >
                                                    Renvoyer le lien
                                                </Link>
                                            </p>
                                        ) : null}

                                        {status === 'verification-link-sent' ? (
                                            <p className="text-sm font-medium text-green-600">
                                                Un nouveau lien de vérification a été envoyé.
                                            </p>
                                        ) : null}

                                        <InputError message={errors.avatar} />

                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={cn(
                                                    AUTH_BTN_PRIMARY,
                                                    'w-full sm:w-auto sm:min-w-[200px]',
                                                )}
                                            >
                                                {processing && (
                                                    <Spinner className="text-white" />
                                                )}
                                                ENREGISTRER
                                            </Button>

                                            <Link
                                                href={route('security.edit')}
                                                className="text-center font-poppins text-sm text-[#737373] hover:text-black"
                                            >
                                                Mot de passe & sécurité
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
