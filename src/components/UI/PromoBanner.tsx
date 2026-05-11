import React from "react";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import promoBanner from "../../assets/promo_banner.png";
import { whatsappUrl } from "../../lib/business";
import { trackEvent } from "../../lib/analytics";

type Promo = {
    title: string;
    sub: string;
    image: string;
    deadlineISO?: string;
    ctaText: string;
    ctaUrl: string;
};

const PROMO: Promo | null = {
    title: "Жаңы окуу жылына даярдык топтомдору",
    sub: "Англис тили, программалоо жана экзаменге даярдык китептерин бир жерден тандаңыз. Кампада барын жана алып кетүү убактысын WhatsApp аркылуу тез тактайбыз.",
    deadlineISO: "2026-09-01T09:00:00+06:00",
    image: promoBanner,
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
    if (!PROMO) return null;
    return <PromoBannerContent promo={PROMO} />;
}

function PromoBannerContent({ promo }: { promo: Promo }) {
    const { d, h, m, s } = useCountdown(promo.deadlineISO);
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
                            <h3 className="mt-4 text-3xl font-semibold leading-tight md:text-[40px]">{promo.title}</h3>
                            <p className="mt-4 max-w-[620px] text-sm leading-6 text-white/78">{promo.sub}</p>

                            {promo.deadlineISO ? (
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
                                <Link to={promo.ctaUrl} onClick={() => trackEvent("promo_catalog_click")} className="dashboard-button-primary bg-white text-edubot-orange hover:bg-white">
                                    {promo.ctaText}
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </Link>
                                <a
                                    href={whatsappUrl("Саламатсызбы, окуу топтому боюнча кеңеш керек.")}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackEvent("promo_whatsapp_click")}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                                >
                                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                    Жардам суроо
                                </a>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <img src={promo.image} alt="" className="h-[240px] w-auto rounded-2xl object-contain md:h-[300px]" loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
