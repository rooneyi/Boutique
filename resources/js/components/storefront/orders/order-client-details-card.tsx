type Props = {
    name?: string | null;
    whatsapp?: string | null;
    address?: string | null;
    city?: string | null;
    district?: string | null;
    note?: string | null;
};

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1 border-b border-[#e8e8e8] py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <span className="font-poppins text-base font-medium text-[#737373]">{label}</span>
            <span className="font-poppins text-base font-semibold text-black">{value}</span>
        </div>
    );
}

export function OrderClientDetailsCard({
    name,
    whatsapp,
    address,
    city,
    district,
    note,
}: Props) {
    const location = [city, district].filter(Boolean).join(', ');

    return (
        <section className="w-full rounded-[20px] bg-white px-6 py-5 shadow-[0_0_2px_rgba(0,0,0,0.12)] sm:px-8">
            <h2 className="font-poppins mb-2 text-2xl font-semibold text-black">Détails client</h2>
            <DetailRow label="Nom" value={name ?? '—'} />
            <DetailRow label="WhatsApp" value={whatsapp ?? '—'} />
            <DetailRow label="Adresse" value={address ?? '—'} />
            {location ? <DetailRow label="Ville / Quartier" value={location} /> : null}
            {note ? <DetailRow label="Note" value={note} /> : null}
        </section>
    );
}
