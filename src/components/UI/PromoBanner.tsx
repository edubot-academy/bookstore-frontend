import React from "react";
import deal_book from '../../assets/deal_book.png';

type Promo = {
    title: string;
    sub: string;
    image: string;
    deadlineISO: string;
    ctaText: string;
    ctaUrl: string;
};

const PROMO: Promo = {
    title: 'All books are 50% off now!',
    sub: "Don't miss such a deal!",
    deadlineISO: '2025-12-01T18:00:00+06:00',
    image: deal_book,
    ctaText: 'Shop deals',
    ctaUrl: '/catalog?sort=new',
};

function useCountdown(deadlineISO?: string) {
    const [parts, setParts] = React.useState({ d: 0, h: 0, m: 0, s: 0 });
    React.useEffect(() => {
        if (!deadlineISO) return;
        const deadline = new Date(deadlineISO).getTime();
        const tick = () => {
            const now = Date.now();
            const diff = Math.max(0, deadline - now);
            const d = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);
            setParts({ d, h, m, s });
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [deadlineISO]);
    return parts;
}

export default function PromoBanner() {
    const { d, h, m, s } = useCountdown(PROMO.deadlineISO);

    const blocks = [
        { label: "DAYS", val: d },
        { label: "HOUR", val: h },
        { label: "MINT", val: m }, // matches the mock’s “MINT”
        { label: "SEC", val: s },
    ];

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="rounded-[24px] bg-secondary p-6 shadow-sm ring-1 ring-border md:p-10">
                    <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
                        {/* Left: text + countdown */}
                        <div>
                            <h3 className="text-3xl font-extrabold leading-tight text-dark md:text-[40px]">
                                {PROMO.title}
                            </h3>

                            <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-text-muted">
                                {PROMO.sub}
                            </p>

                            {/* Countdown (inline numbers like the mock, no boxes) */}
                            <div className="mt-8 grid grid-cols-4 gap-4 md:gap-8">
                                {blocks.map((t) => (
                                    <div key={t.label} className="space-y-1">
                                        <div className="text-2xl font-extrabold tracking-wide text-primary md:text-[24px]">
                                            {String(t.val).padStart(2, "0")}
                                        </div>
                                        <div className="text-[11px] uppercase tracking-[0.36em] text-text-muted">
                                            {t.label}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pager dots */}
                            <div className="mt-8 flex items-center gap-3">
                                <button
                                    aria-label="Active slide"
                                    className="grid h-8 w-8 place-items-center rounded-full border border-primary text-primary"
                                >
                                    <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
                                </button>
                                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
                                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
                                <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
                            </div>
                        </div>

                        {/* Right: image */}
                        <div className="flex justify-center">
                            <img
                                src={PROMO.image}
                                alt="Promo stack of books"
                                className="h-[240px] w-auto rounded-xl object-contain md:h-[300px]"
                                loading="lazy"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
