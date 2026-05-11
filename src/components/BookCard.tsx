import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Book } from '../lib/types';
import { useCart } from '../hooks/useCart';
import { availabilityLabel, stockText } from '../lib/labels';

const formatKgs = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "KGS", maximumFractionDigits: 0 }).format(n);

export default function BookCard({ b }: { b: Book }) {
    const { addItem } = useCart();
    const authorText = b.authors?.map((author) => author.name).join(', ') || '-';
    const image = b.coverUrl || 'https://placehold.co/360x480?text=Китеп';
    const href = b.url || `/books/${b.id}`;
    const price = Number(b.price);
    const stock = b.stock ?? 0;
    const availability = availabilityLabel(stock);

    return (
        <article className="group rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-soft transition hover:-translate-y-1 hover:border-edubot-orange/50 hover:shadow-edubot-hover-soft">
            <div className="relative">
                <Link to={href} className="block aspect-[3/4] overflow-hidden rounded-xl bg-edubot-surface">
                    {b.isSale && (
                        <span className="absolute left-2 top-2 z-10 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                            АРЗАНДАТУУ
                        </span>
                    )}
                    <img
                        src={image}
                        alt={b.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                    />
                </Link>

                <button
                    type="button"
                    className={[
                        "absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold tracking-widest text-white shadow-edubot-soft",
                        "opacity-0 translate-y-3 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0",
                        b.emphasize ? "opacity-100 translate-y-0" : "",
                        stock <= 0 ? "cursor-not-allowed opacity-70" : "",
                    ].join(" ")}
                    disabled={stock <= 0}
                    onClick={() => { if (stock > 0) addItem(b); }}
                >
                    <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                    {stock <= 0 ? 'КАМПАДА ЖОК' : 'СЕБЕТКЕ КОШУУ'}
                </button>
            </div>

            <Link to={href} className="mt-5 block space-y-1">
                <div className="line-clamp-2 text-[15px] font-semibold text-edubot-ink group-hover:text-primary">{b.title}</div>
                <div className="text-xs text-edubot-muted">{authorText}</div>
                <div className="text-xs text-edubot-muted">{b.subject || b.category?.name || 'Категория жок'} / {availability}</div>
                {(b.language || b.gradeLevel) && (
                    <div className="text-xs text-edubot-muted">{[b.language, b.gradeLevel].filter(Boolean).join(' / ')}</div>
                )}
                <div className="text-xs text-edubot-muted">{stockText(stock)}</div>
                <div className="pt-1 text-[15px] font-bold text-primary">{formatKgs(Number.isFinite(price) ? price : 0)}</div>
            </Link>
        </article>
    );
}
