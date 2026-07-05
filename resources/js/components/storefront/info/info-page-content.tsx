export type InfoSection = {
    title: string;
    paragraphs: string[];
};

type Props = {
    sections: InfoSection[];
};

export function InfoPageContent({ sections }: Props) {
    return (
        <div className="mx-auto max-w-[1440px] space-y-10 px-4 sm:px-8 lg:px-[100px]">
            {sections.map((section) => (
                <article key={section.title} className="space-y-3">
                    <h2 className="font-poppins text-xl font-semibold text-black sm:text-2xl">
                        {section.title}
                    </h2>
                    <div className="space-y-3 font-poppins text-sm leading-relaxed text-[#484848] sm:text-base">
                        {section.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </article>
            ))}
        </div>
    );
}
