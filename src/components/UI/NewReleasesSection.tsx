import React from "react";
import BookCard from "../BookCard";
import new_book_1 from "../../assets/new_book_1.png";
import new_book_2 from "../../assets/new_book_2.png";
import new_book_3 from "../../assets/new_book_3.png";
import new_book_4 from "../../assets/new_book_4.png";
import type { Book } from "../../lib/types";

const NEW_RELEASES: Book[] = [
    {
        id: 1,
        title: "Simple Way Of Piece Life",
        author: "Armor Ramsey",
        price: 4000,
        image: new_book_1, url: "/books/1",
        isSale: true
    },
    {
        id: 2,
        title: "Great Travel At Desert",
        author: "Sanchit Howdy",
        price: 3800,
        image: new_book_2,
        url: "/books/2"

    },
    {
        id: 3,
        title: "The Lady Beauty Scarlett",
        author: "Arthur Doyle",
        price: 4500,
        image: new_book_3,
        url: "/books/3"

    },
    {
        id: 4,
        title: "Once Upon A Time",
        author: "Klien Marry",
        price: 3500,
        image: new_book_4,
        url: "/books/4"

    },
];


export default function NewReleasesSection() {
    const scrollerRef = React.useRef<HTMLDivElement | null>(null);
    const [page, setPage] = React.useState(0);

    React.useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const onScroll = () => {
            const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 16 : 1;
            setPage(Math.round(el.scrollLeft / cardWidth));
        };
        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (idx: number) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.children[idx] as HTMLElement | undefined;
        if (card) el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    };

    return (
        <section className="bg-secondary">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="mb-10 text-center">
                    <div className="relative mx-auto mb-4 flex items-center justify-center">
                        <span className="h-px w-24 bg-border" />
                        <span className="mx-4 text-[11px] uppercase tracking-[0.25em] text-text-muted">
                            Some Quality Items
                        </span>
                        <span className="h-px w-24 bg-border" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-dark md:text-[40px]">
                        New Release Books
                    </h2>
                </div>

                {/* desktop grid */}
                <div className="hidden gap-6 md:grid md:grid-cols-4">
                    {NEW_RELEASES.map((b) => (
                        <BookCard key={b.id} b={b} />
                    ))}
                </div>

                {/* mobile carousel */}
                <div
                    ref={scrollerRef}
                    className="md:hidden flex gap-4 overflow-x-auto scroll-smooth px-1 pb-2 snap-x snap-mandatory"
                >
                    {NEW_RELEASES.map((b) => (
                        <div key={b.id} className="min-w-[70%] snap-start">
                            <BookCard b={b} />
                        </div>
                    ))}
                </div>

                {/* dots */}
                <div className="mt-6 flex justify-center gap-3 md:hidden">
                    {NEW_RELEASES.map((_, i) => (
                        <button
                            key={i}
                            aria-label={`Go to slide ${i + 1}`}
                            onClick={() => scrollTo(i)}
                            className={[
                                "h-2.5 w-2.5 rounded-full transition-all",
                                page === i ? "bg-primary scale-110" : "bg-text-muted/30",
                            ].join(" ")}
                        />
                    ))}
                </div>

                {/* footer link */}
                <div className="mt-10 flex justify-end">
                    <a href="/catalog?sort=new" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                        View All Products <span aria-hidden className="ml-1">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
