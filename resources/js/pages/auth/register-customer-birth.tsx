import { Form, Head, Link } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { useRef, useState } from 'react';
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

export default function RegisterCustomerBirth() {
    const dateRef = useRef<HTMLInputElement>(null);
    const [birthDate, setBirthDate] = useState('');

    return (
        <>
            <Head title="Date de naissance · PCJ" />

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
                    action={route('auth.customer.register.birth.store')}
                    className="flex w-full flex-col items-center gap-[25px]"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="flex w-full flex-col items-end gap-[60px] pb-2">
                                <div className="relative w-full">
                                    <Input
                                        ref={dateRef}
                                        id="birth_date"
                                        name="birth_date"
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        required
                                        disabled={processing}
                                        max={new Date().toISOString().slice(0, 10)}
                                        className={`${AUTH_INPUT_UNDERLINE} pr-10 text-black [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:size-10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                                        aria-label="Date de naissance"
                                    />
                                    {!birthDate && (
                                        <span
                                            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 font-poppins text-base text-[rgba(91,94,100,0.62)]"
                                            aria-hidden
                                        >
                                            Date de naissance
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        tabIndex={-1}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[rgba(91,94,100,0.62)]"
                                        onClick={() => {
                                            dateRef.current?.showPicker?.();
                                            dateRef.current?.focus();
                                        }}
                                        aria-label="Ouvrir le calendrier"
                                    >
                                        <Calendar className="size-6" strokeWidth={1.5} />
                                    </button>
                                    <InputError message={errors.birth_date} className="mt-1" />
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

RegisterCustomerBirth.layout = {
    variant: 'split',
};
