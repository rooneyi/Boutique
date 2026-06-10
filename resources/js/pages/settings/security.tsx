import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import {
    AdminCard,
    AdminCardContent,
    AdminCardDescription,
    AdminCardHeader,
} from '@/components/admin/admin-card';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { ADMIN_BTN_SM_OUTLINE, ADMIN_BTN_SM_PRIMARY, ADMIN_H3, ADMIN_MUTED } from '@/lib/admin-ui-styles';
import { edit } from '@/routes/security';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        clearTwoFactorAuthData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();

    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);
    const prevTwoFactorEnabled = useRef(twoFactorEnabled);

    useEffect(() => {
        if (prevTwoFactorEnabled.current && !twoFactorEnabled) {
            clearTwoFactorAuthData();
        }
        prevTwoFactorEnabled.current = twoFactorEnabled;
    }, [twoFactorEnabled, clearTwoFactorAuthData]);

    return (
        <>
            <Head title="Sécurité" />
            <h1 className="sr-only">Paramètres de sécurité</h1>

            <AdminCard>
                <AdminCardHeader>
                    <h3 className={ADMIN_H3}>Modifier le mot de passe</h3>
                    <AdminCardDescription>
                        Utilisez un mot de passe long et aléatoire pour sécuriser
                        votre compte.
                    </AdminCardDescription>
                </AdminCardHeader>
                <AdminCardContent>
                    <Form
                        {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={[
                            'password',
                            'password_confirmation',
                            'current_password',
                        ]}
                        resetOnSuccess
                        onError={(errs) => {
                            if (errs.password) passwordInput.current?.focus();
                            if (errs.current_password)
                                currentPasswordInput.current?.focus();
                        }}
                        className="space-y-5"
                    >
                        {({ errors: formErrors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="current_password"
                                        className="font-poppins text-sm font-medium text-slate-700"
                                    >
                                        Mot de passe actuel
                                    </Label>
                                    <PasswordInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        className="font-poppins"
                                        autoComplete="current-password"
                                        placeholder="Mot de passe actuel"
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={formErrors.current_password}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="font-poppins text-sm font-medium text-slate-700"
                                    >
                                        Nouveau mot de passe
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        className="font-poppins"
                                        autoComplete="new-password"
                                        placeholder="Nouveau mot de passe"
                                        disabled={processing}
                                    />
                                    <InputError message={formErrors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="font-poppins text-sm font-medium text-slate-700"
                                    >
                                        Confirmer le mot de passe
                                    </Label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        className="font-poppins"
                                        autoComplete="new-password"
                                        placeholder="Confirmer le mot de passe"
                                        disabled={processing}
                                    />
                                    <InputError
                                        message={formErrors.password_confirmation}
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={ADMIN_BTN_SM_PRIMARY}
                                    >
                                        {processing
                                            ? 'Enregistrement…'
                                            : 'Enregistrer le mot de passe'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </AdminCardContent>
            </AdminCard>

            {canManageTwoFactor && (
                <AdminCard>
                    <AdminCardHeader>
                        <h3 className={ADMIN_H3}>
                            Authentification à deux facteurs
                        </h3>
                        <AdminCardDescription>
                            Ajoutez une couche de sécurité supplémentaire à
                            votre compte.
                        </AdminCardDescription>
                    </AdminCardHeader>
                    <AdminCardContent className="space-y-4">
                        {twoFactorEnabled ? (
                            <>
                                <p className={ADMIN_MUTED}>
                                    Lors de la connexion, un code sécurisé vous
                                    sera demandé. Récupérez-le depuis
                                    l&apos;application TOTP sur votre téléphone.
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Form {...disable.form()}>
                                        {({ processing: proc }) => (
                                            <button
                                                type="submit"
                                                disabled={proc}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 font-poppins text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                                            >
                                                Désactiver le 2FA
                                            </button>
                                        )}
                                    </Form>
                                </div>
                                <TwoFactorRecoveryCodes
                                    recoveryCodesList={recoveryCodesList}
                                    fetchRecoveryCodes={fetchRecoveryCodes}
                                    errors={errors}
                                />
                            </>
                        ) : (
                            <>
                                <p className={ADMIN_MUTED}>
                                    Activez le 2FA pour sécuriser davantage
                                    votre compte lors de la connexion.
                                </p>
                                <div>
                                    {hasSetupData ? (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowSetupModal(true)
                                            }
                                            className={ADMIN_BTN_SM_PRIMARY}
                                        >
                                            <ShieldCheck className="size-4" />
                                            Continuer la configuration
                                        </button>
                                    ) : (
                                        <Form
                                            {...enable.form()}
                                            onSuccess={() =>
                                                setShowSetupModal(true)
                                            }
                                        >
                                            {({ processing: proc }) => (
                                                <button
                                                    type="submit"
                                                    disabled={proc}
                                                    className={ADMIN_BTN_SM_PRIMARY}
                                                >
                                                    Activer le 2FA
                                                </button>
                                            )}
                                        </Form>
                                    )}
                                </div>
                            </>
                        )}
                    </AdminCardContent>
                </AdminCard>
            )}

            <TwoFactorSetupModal
                isOpen={showSetupModal}
                onClose={() => setShowSetupModal(false)}
                requiresConfirmation={requiresConfirmation}
                twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg}
                manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData}
                fetchSetupData={fetchSetupData}
                errors={errors}
            />
        </>
    );
}

Security.layout = {
    breadcrumbs: [{ title: 'Sécurité', href: edit() }],
};
