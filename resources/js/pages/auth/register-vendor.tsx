import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterVendor() {
    return (
        <>
            <Head title="Devenir Vendeur" />

            <div className="mx-auto max-w-sm space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Créer une Boutique</h1>
                    <p className="text-sm text-muted-foreground">
                        Rejoignez notre plateforme en tant que vendeur
                    </p>
                </div>

                <Form
                    method="post"
                    action={route('auth.vendor.register')}
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
                                    placeholder="Jean Dupont"
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
                                    placeholder="boutique@example.com"
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Nom de Boutique */}
                            <div className="grid gap-2">
                                <Label htmlFor="shop_name">Nom de Boutique</Label>
                                <Input
                                    id="shop_name"
                                    name="shop_name"
                                    type="text"
                                    placeholder="Ma Boutique Chic"
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.shop_name} />
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
                                    Vous pourrez gérer votre boutique et vos produits après inscription
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
                                    'Créer ma Boutique'
                                )}
                            </Button>

                            {/* Lien vers connexion */}
                            <div className="text-center text-sm">
                                Vous avez déjà un compte?{' '}
                                <TextLink href={route('login')}>
                                    Se connecter
                                </TextLink>
                            </div>

                            {/* Lien vers inscription client */}
                            <div className="text-center text-sm">
                                Vous recherchez plutôt un compte client?{' '}
                                <TextLink href={route('auth.customer.register')}>
                                    Inscription client
                                </TextLink>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}
