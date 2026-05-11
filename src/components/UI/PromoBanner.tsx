import React from "react";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import dealBook from "../../assets/deal_book.png";

type Promo = {
    title: string;
    sub: string;
    image: string;
    deadlineISO?: string;
    ctaText: string;
    ctaUrl: string;
};

const PROMO: Promo = {
    title: "Мектепке даярдык китептери жана окуу топтомдору",
    sub: "Бул бөлүктү кийин мектепке даярдык, экзаменге даярдануу же курс баштоо топтомдору сыяктуу сезондук кампаниялар үчүн колдонуңуз.",
    deadlineISO: "2026-09-01T09:00:00+06:00",
    image: dealBook,
    ctaText: "Окуу китептерин көрүү",
    ctaUrl: "/catalog?bookType=EXAM_PREP",
};

function useCountdown(deadlineISO?: string) {
    const [parts, setParts] = React.useState({ d: 0, h: 0, m: 0, s: 0 });

    React.useEffect(() => {
        if (!deadlineISO) return;
        const deadline = new Date(deadlineISO).getTime();
        const tick = () => {
            const diff = Math.max(0, deadline - Date.now());
            setParts({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / (1000 * 60)) % 60),
                s: Math.floor((diff / 1000) % 60),
            });
        };
        tick();
        const id = window.setInterval(tick, 1000);
        return () => window.clearInterval(id);
    }, [deadlineISO]);

    return parts;
}

export default function PromoBanner() {
    const { d, h, m, s } = useCountdown(PROMO.deadlineISO);
    const blocks = [
        { label: "Күн", value: d },
        { label: "Саат", value: h },
        { label: "Мүнөт", value: m },
        { label: "Секунд", value: s },
    ];

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="overflow-hidden rounded-2xl border border-edubot-line bg-edubot-hero p-6 text-white shadow-edubot-card md:p-10">
                    <div className="grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr]">
                        <div>
                            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                EduBook сезондук кампаниясы
                            </p>
                            <h3 className="mt-4 text-3xl font-semibold leading-tight md:text-[40px]">{PROMO.title}</h3>
                            <p className="mt-4 max-w-[620px] text-sm leading-6 text-white/78">{PROMO.sub}</p>

                            {PROMO.deadlineISO ? (
                                <div className="mt-7 grid grid-cols-4 gap-3">
                                    {blocks.map((item) => (
                                        <div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-3">
                                            <div className="text-2xl font-semibold">{String(item.value).padStart(2, "0")}</div>
                                            <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/65">{item.label}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link to={PROMO.ctaUrl} className="dashboard-button-primary bg-white text-edubot-orange hover:bg-white">
                                    {PROMO.ctaText}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <a
                                    href="https://wa.me/996700123456"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                    Жардам суроо
                                </a>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <img src={PROMO.image} alt="" className="h-[240px] w-auto rounded-2xl object-contain md:h-[300px]" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
