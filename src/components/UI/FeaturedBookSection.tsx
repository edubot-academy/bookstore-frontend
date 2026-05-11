import React from "react";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import FeaturedBook from "../../assets/featured_book.png";

type Featured = {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    url: string;
    audience: string;
    subject: string;
    excerpt: string;
};

const FEATURED_ITEMS: Featured[] = [
    {
        id: 1,
        title: "Веб иштеп чыгуу үчүн баштапкы окуу топтому",
        author: "EduBook тандоосу",
        price: 4500,
        image: FeaturedBook,
        url: "/catalog?bookType=PROGRAMMING",
        audience: "Программалоону жаңы баштагандар",
        subject: "Программалоо",
        excerpt: "HTML, CSS, JavaScript жана заманбап веб иштеп чыгуунун негиздерин баштаган окуучулар үчүн практикалык тандоо.",
    },
    {
        id: 2,
        title: "Англис тили үчүн негизги китептер",
        author: "EduBook тандоосу",
        price: 4200,
        image: FeaturedBook,
        url: "/catalog?bookType=LANGUAGE_LEARNING",
        audience: "Окуучулар жана ата-энелер",
        subject: "Англис тили",
        excerpt: "Сөз байлыгын, грамматиканы, окуу көндүмүн жана үйдө үзгүлтүксүз машыгууну өнүктүрүүгө ылайыктуу китептер.",
    },
    {
        id: 3,
        title: "Экзаменге даярдык үчүн тандоолор",
        author: "EduBook тандоосу",
        price: 3900,
        image: FeaturedBook,
        url: "/catalog?bookType=EXAM_PREP",
        audience: "Экзаменге даярданып жаткан окуучулар",
        subject: "Экзаменге даярдык",
        excerpt: "Кайталоо, тесттер жана мектеп же тил экзамендерине иреттүү даярдануу үчүн багытталган материалдар.",
    },
];

const formatKgs = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KGS", maximumFractionDigits: 0 }).format(n);

const ArrowBtn = ({ onClick, dir }: { onClick: () => void; dir: "prev" | "next" }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={dir === "prev" ? "Мурунку сунушталган тандоо" : "Кийинки сунушталган тандоо"}
        className="grid h-10 w-10 place-items-center rounded-full border border-edubot-line bg-white text-edubot-ink transition hover:border-edubot-orange hover:text-edubot-orange"
    >
        {dir === "prev" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
);

export default function FeaturedBookSection() {
    if (FEATURED_ITEMS.length === 0) return null;

    return <FeaturedBookCarousel />;
}

function FeaturedBookCarousel() {
    const [idx, setIdx] = React.useState(0);
    const item = FEATURED_ITEMS[idx];
    const go = React.useCallback((n: number) => {
        setIdx((p) => (p + n + FEATURED_ITEMS.length) % FEATURED_ITEMS.length);
    }, []);

    React.useEffect(() => {
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") go(-1);
            if (event.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [go]);

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14">
                <div className="relative overflow-hidden rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-5 shadow-edubot-card md:p-8">
                    <div className="grid items-center gap-8 md:grid-cols-[340px_1fr]">
                        <div className="rounded-2xl bg-white p-4 shadow-edubot-soft">
                            <img src={item.image} alt={item.title} className="aspect-[3/4] w-full rounded-xl object-cover" loading="lazy" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">Сунушталган окуу тандоосу</p>
                            <h3 className="mt-3 text-3xl font-semibold leading-tight text-edubot-ink md:text-[40px]">{item.title}</h3>
                            <p className="mt-2 text-sm font-medium text-edubot-muted">{item.author}</p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-full bg-edubot-orange/10 px-3 py-1 text-xs font-semibold text-edubot-orange">{item.subject}</span>
                                <span className="rounded-full bg-edubot-teal/10 px-3 py-1 text-xs font-semibold text-edubot-teal">{item.audience}</span>
                            </div>

                            <p className="mt-5 max-w-2xl text-sm leading-6 text-edubot-muted">{item.excerpt}</p>
                            <div className="mt-5 text-2xl font-semibold text-primary">{formatKgs(item.price)}</div>

                            <div className="mt-7 flex flex-wrap items-center gap-3">
                                <Link to={item.url} className="dashboard-button-primary">
                                    <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                                    Окшош китептерди көрүү
                                </Link>
                                <div className="flex items-center gap-2">
                                    <ArrowBtn dir="prev" onClick={() => go(-1)} />
                                    <ArrowBtn dir="next" onClick={() => go(1)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-center gap-2">
                        {FEATURED_ITEMS.map((slide, index) => (
                            <button
                                key={slide.id}
                                type="button"
                                onClick={() => setIdx(index)}
                                aria-label={`Сунушталган тандоо ${index + 1}`}
                                className={`h-2.5 rounded-full transition ${index === idx ? "w-8 bg-edubot-orange" : "w-2.5 bg-edubot-line"}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
