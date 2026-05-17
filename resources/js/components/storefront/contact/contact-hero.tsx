import contactHero from '../../../../media/contact-hero.jpg';

export function ContactHero() {
    return (
        <section className="w-full bg-[#292d32]">
            <div className="mx-auto flex h-[min(575px,70vh)] max-w-[1440px] items-center justify-end overflow-hidden px-4 sm:px-8 lg:px-0">
                <img
                    src={contactHero}
                    alt="Équipe POSE COMME JAMAIS"
                    className="h-full max-h-[575px] w-auto max-w-[min(411px,55vw)] object-cover object-center"
                />
            </div>
        </section>
    );
}
