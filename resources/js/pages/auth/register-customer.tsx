import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterCustomer() {
    return (
        <>
            <Head title="S'inscrire" />

            <div className="mx-auto max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Créer un Compte Client</h1>
                    <p className="text-sm text-muted-foreground">
                        Parcourez et achetez vos vêtements préférés
                    </p>
                </div>

                <Form
                    method="post"
                    action={route('auth.customer.register')}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            {/* Nom */}
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom Complet</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Marie Martin"
                                    required
                                    autoFocus
                                    disabled={processing}
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="marie@example.com"
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Mot de passe */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirmation mot de passe */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    Confirmer le mot de passe
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    placeholder="••••••••"
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            {/* Information */}
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Créez un compte pour profiter d'une meilleure expérience de shopping
                                </AlertDescription>
                            </Alert>

                            {/* Bouton */}
                            <Button
                                className="w-full"
                                disabled={processing}
                                type="submit"
                            >
                                {processing ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />
                                        Création en cours...
                                    </>
                                ) : (
                                    'S\'inscrire'
                                )}
                            </Button>

                            {/* Lien vers connexion */}
                            <div className="text-center text-sm">
                                Vous avez déjà un compte?{' '}
                                <TextLink href={route('login')}>
                                    Se connecter
                                </TextLink>
                            </div>

                            {/* Lien vers inscription vendeur */}
                            <div className="text-center text-sm">
                                Vous êtes vendeur?{' '}
                                <TextLink href={route('auth.vendor.register')}>
                                    Créer une boutique
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
