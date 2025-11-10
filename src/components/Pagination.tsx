type Props = {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
    className?: string;
};

export default function Pagination({ page, totalPages, onChange, className = '' }: Props) {
    if (!totalPages || totalPages <= 1) return null;

    const prev = () => onChange(Math.max(1, page - 1));
    const next = () => onChange(Math.min(totalPages, page + 1));

    // show a small window of pages
    const window = 1;
    const start = Math.max(1, page - window);
    const end = Math.min(totalPages, page + window);
    const pages = [];
    for (let p = start; p <= end; p++) pages.push(p);

    const btn =
        'inline-flex items-center justify-center rounded-xl border px-3 py-1.5 text-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50';

    return (
        <nav className={`mt-4 flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
            <button className={btn} onClick={prev} disabled={page === 1} aria-label="Мурунку бет">
                ←
            </button>

            {start > 1 && (
                <>
                    <button className={btn} onClick={() => onChange(1)}>1</button>
                    {start > 2 && <span className="px-1 text-sm text-gray-500">…</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    className={`${btn} ${p === page ? 'bg-black text-white hover:bg-black' : ''}`}
                    onClick={() => onChange(p)}
                    aria-current={p === page ? 'page' : undefined}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-1 text-sm text-gray-500">…</span>}
                    <button className={btn} onClick={() => onChange(totalPages)}>{totalPages}</button>
                </>
            )}

            <button className={btn} onClick={next} disabled={page === totalPages} aria-label="Кийинки бет">
                →
            </button>
        </nav>
    );
}
