import React from "react";
import FeaturedBook from "../../assets/featured_book.png";

type Featured = {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    url: string;
    excerpt: string;
};


const FEATURED_ITEMS: Featured[] = [
    {
        id: 1,
        title: "Birds Gonna Be Happy",
        author: "Timbur Hood",
        price: 4500,
        image: FeaturedBook,
        url: "/books/featured-1",
        excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero ipsum enim pharetra hac.",
    },
    { id: 2, title: "Dreams In The Field", author: "Ava Cooper", price: 4200, image: FeaturedBook, url: "/books/featured-2", excerpt: "Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper." },
    { id: 3, title: "Morning Coffee Tales", author: "Mason Blake", price: 3900, image: FeaturedBook, url: "/books/featured-3", excerpt: "Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet." },
];

const formatKgs = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KGS", maximumFractionDigits: 2 }).format(n);

const ArrowBtn = ({ onClick, dir }: { onClick: () => void; dir: "prev" | "next" }) => (
    <button
        type="button"
        onClick={onClick}
        aria-label={dir === "prev" ? "Previous" : "Next"}
        className="grid h-10 w-10 place-items-center rounded-full border border-primary text-primary transition hover:bg-primary/10"
    >
        <span className={dir === "next" ? "rotate-0" : "rotate-180"}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </span>
    </button>
);

export default function FeaturedBookSection() {
    const [idx, setIdx] = React.useState(0);
    const item = FEATURED_ITEMS[idx];
    const go = (n: number) => setIdx((p) => (p + n + FEATURED_ITEMS.length) % FEATURED_ITEMS.length);

    React.useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") go(-1);
            if (e.key === "ArrowRight") go(1);
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, []);

    return (
        <section className="bg-white">
            <div className="mx-auto w-full px-4 py-14">
                <div className="relative rounded-[28px] bg-secondary p-4 shadow-sm ring-1 ring-border md:p-8">
                    <div className="grid items-center gap-8 md:grid-cols-[1.05fr_1fr]">
                        {/* left arrow */}
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 md:left-8">
                            <ArrowBtn dir="prev" onClick={() => go(-1)} />
                        </div>

                        {/* book image in white frame */}
                        <div className="order-1 md:order-none">
                            <div className="mx-auto w-[86%] rounded-[14px] bg-white p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:w-[90%]">
                                <img src={item.image} alt={item.title} className="aspect-[3/4] w-full rounded-[10px] object-cover" loading="lazy" />
                            </div>
                        </div>

                        {/* content */}
                        <div className="pr-2">
                            <h3 className="text-[40px] font-extrabold leading-tight text-dark">Featured Book</h3>

                            <div className="mt-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-[3px] w-14 rounded bg-primary" />
                                    <span className="text-[11px] tracking-[0.28em] text-text-muted">BY {item.author.toUpperCase()}</span>
                                </div>
                            </div>

                            <a href={item.url} className="mt-5 block text-2xl font-bold text-dark hover:underline">
                                {item.title}
                            </a>

                            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-text-muted">{item.excerpt}</p>

                            <div className="mt-6 text-xl font-extrabold text-primary">{formatKgs(item.price)}</div>

                            <div className="mt-8">
                                <a
                                    href={item.url}
                                    className="inline-flex items-center gap-3 rounded-xl border-2 border-dark px-6 py-3 text-sm font-semibold text-dark transition hover:bg-dark/5"
                                >
                                    VIEW MORE
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* right arrow */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 md:right-8">
                            <ArrowBtn dir="next" onClick={() => go(1)} />
                        </div>
                    </div>

                    {/* dots */}
                    <div className="mt-10 flex justify-center gap-3">
                        {FEATURED_ITEMS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIdx(i)}
                                aria-label={`Go to slide ${i + 1}`}
                                className={["h-3 w-3 rounded-full transition", i === idx ? "bg-primary" : "bg-text-muted/30"].join(" ")}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
