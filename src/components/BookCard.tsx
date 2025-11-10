import { Link } from 'react-router-dom';
import type { Book } from '../lib/types';

const formatKgs = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KGS", maximumFractionDigits: 0 }).format(n);

export default function BookCard({ b }: { b: Book }) {
    return (
        <Link
            to={b.url}
            className="group block rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral/60">
                {b.isSale && (
                    <span className="absolute left-2 top-2 rounded bg-primary z-10 px-2 py-0.5 text-xs font-semibold text-white">
                        SALE
                    </span>
                )}
                <img
                    src={b.image}
                    alt={b.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                />

                {/* Add to cart ribbon */}
                <button
                    type="button"
                    className={[
                        "absolute left-1/2 bottom-4 -translate-x-1/2 rounded-md bg-primary px-5 py-2 text-xs font-semibold tracking-widest text-white shadow",
                        "opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0",
                        b.emphasize ? "opacity-100 translate-y-0" : "",
                    ].join(" ")}
                    onClick={(e) => e.preventDefault()}
                >
                    ADD TO CART
                </button>
            </div>

            <div className="mt-5 space-y-1">
                <div className="line-clamp-2 text-[15px] font-semibold text-dark">{b.title}</div>
                <div className="text-xs text-text-muted">{b.author}</div>
                <div className="pt-1 text-[15px] font-bold text-primary">{formatKgs(b.price)}</div>
            </div>
        </Link>
    );
}
