import { Form } from '@inertiajs/react';
import { ChevronDown, Send, ShieldCheck } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { route } from '@/lib/route';
import { cn } from '@/lib/utils';

const FIELD_LABEL =
    'font-poppins text-sm font-medium leading-snug text-black';

const FIELD_INPUT =
    'font-poppins h-auto w-full rounded-[20px] border border-[#6b7280] bg-white px-6 py-2.5 text-sm text-black placeholder:text-[#6b7280] focus-visible:border-black focus-visible:ring-black/10';

type Props = {
    subjects: Record<string, string>;
    success?: string;
    defaultName?: string;
    defaultEmail?: string;
};

export function ContactForm({
    subjects,
    success,
    defaultName = '',
    defaultEmail = '',
}: Props) {
    return (
        <section className="mx-auto w-full max-w-[768px] px-4 py-12 sm:px-6 lg:px-0 lg:pb-16 lg:pt-14">
            <div className="mb-10 flex items-center gap-3">
                <Send className="size-6 shrink-0 text-black" strokeWidth={1.5} />
                <h2 className="font-poppins text-xl font-medium text-black">
                    Envoyez-nous un message
                </h2>
            </div>

            {success && (
                <p className="mb-8 font-poppins text-sm font-medium text-green-700">
                    {success}
                </p>
            )}

            <Form
                method="post"
                action={route('contact.store')}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name" className={FIELD_LABEL}>
                                    Nom complet
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    defaultValue={defaultName}
                                    disabled={processing}
                                    className={FIELD_INPUT}
                                    autoComplete="name"
                                />
                                <InputError message={errors.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className={FIELD_LABEL}>
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    defaultValue={defaultEmail}
                                    disabled={processing}
                                    className={FIELD_INPUT}
                                    autoComplete="email"
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject" className={FIELD_LABEL}>
                                Sujet
                            </Label>
                            <div className="relative">
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    disabled={processing}
                                    defaultValue=""
                                    className={cn(
                                        FIELD_INPUT,
                                        'appearance-none pr-12',
                                    )}
                                >
                                    <option value="" disabled>
                                        Selection un sujet
                                    </option>
                                    {Object.entries(subjects).map(([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    className="pointer-events-none absolute right-6 top-1/2 size-6 -translate-y-1/2 text-[#6b7280]"
                                    aria-hidden
                                />
                            </div>
                            <InputError message={errors.subject} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message" className={FIELD_LABEL}>
                                Message
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                disabled={processing}
                                className={cn(FIELD_INPUT, 'min-h-[140px] resize-y py-3')}
                                placeholder="Décrivez votre demande…"
                            />
                            <InputError message={errors.message} />
                        </div>

                        

                        <div className="flex items-start gap-2 pt-1">
                            <ShieldCheck
                                className="mt-0.5 size-6 shrink-0 text-[rgba(91,94,100,0.62)]"
                                strokeWidth={1.5}
                            />
                            <p className="font-poppins text-sm leading-snug text-[rgba(91,94,100,0.62)]">
                                Vos données sont sécurisées et confidentielles.et nous
                                repondons dans les plus bref delais
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="font-poppins h-auto w-fit rounded-[22px] border border-black bg-black px-5 py-5 text-xl font-bold text-white hover:bg-neutral-800"
                        >
                            {processing && <Spinner className="text-white" />}
                            Envoyer
                        </Button>
                    </>
                )}
            </Form>
        </section>
    );
}
