import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ADMIN_BTN_SM_PRIMARY, ADMIN_H3 } from '@/lib/admin-ui-styles';
import { send } from '@/routes/verification';
import { edit } from '@/routes/profile';

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profil" />
            <h1 className="sr-only">Paramètres du profil</h1>

            <AdminCard>
                <AdminCardHeader>
                    <h3 className={ADMIN_H3}>Informations du profil</h3>
                    <AdminCardDescription>
                        Mettez à jour votre nom et votre adresse e-mail.
                    </AdminCardDescription>
                </AdminCardHeader>
                <AdminCardContent>
                    <Form
                        {...ProfileController.update.form()}
                        options={{ preserveScroll: true }}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="name"
                                        className="font-poppins text-sm font-medium text-slate-700"
                                    >
                                        Nom complet
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        defaultValue={auth.user.name}
                                        required
                                        autoComplete="name"
                                        placeholder="Nom complet"
                                        className="font-poppins"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="font-poppins text-sm font-medium text-slate-700"
                                    >
                                        Adresse e-mail
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        defaultValue={auth.user.email}
                                        required
                                        autoComplete="username"
                                        placeholder="Adresse e-mail"
                                        className="font-poppins"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                                            <p className="font-poppins text-sm text-amber-700">
                                                Votre adresse e-mail n&apos;est
                                                pas vérifiée.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="font-semibold text-[#0059DD] hover:underline"
                                                >
                                                    Renvoyer le lien de
                                                    vérification.
                                                </Link>
                                            </p>
                                            {status ===
                                                'verification-link-sent' && (
                                                <p className="mt-1 font-poppins text-sm font-medium text-green-600">
                                                    Un nouveau lien a été envoyé
                                                    à votre adresse e-mail.
                                                </p>
                                            )}
                                        </div>
                                    )}

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={ADMIN_BTN_SM_PRIMARY}
                                    >
                                        {processing
                                            ? 'Enregistrement…'
                                            : 'Enregistrer'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </AdminCardContent>
            </AdminCard>

            <DeleteUser />
        </>
    );
}

Profile.layout = {
    breadcrumbs: [{ title: 'Profil', href: edit() }],
};
