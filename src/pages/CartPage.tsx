import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const formatKgs = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(value);

export default function CartPage() {
    const { items, subtotal, updateQty, removeItem } = useCart();

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12 text-center">
                <div className="rounded-2xl border border-edubot-line bg-white p-8 shadow-edubot-card">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                        <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl font-semibold text-edubot-ink">Себет</h1>
                    <p className="mt-3 text-edubot-muted">Себетиңиз бош.</p>
                    <Link to="/books" className="dashboard-button-primary mt-6">
                    Китептерди көрүү
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">EduBook буйрутмасы</p>
                    <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">Себет</h1>
                </div>
                <div className="rounded-full border border-edubot-line bg-edubot-surfaceAlt px-4 py-2 text-xs font-semibold text-edubot-muted">
                    {items.length} китеп тандалды
                </div>
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="overflow-hidden rounded-2xl border border-edubot-line bg-white shadow-edubot-card">
                    {items.map((item) => (
                        <div key={item.book.id} className="grid gap-4 border-b border-edubot-line p-4 last:border-b-0 sm:grid-cols-[80px_1fr_auto]">
                            <img
                                src={item.book.coverUrl || 'https://placehold.co/160x220?text=Китеп'}
                                alt={item.book.title}
                                className="aspect-[3/4] w-20 rounded object-cover"
                            />
                            <div>
                                <Link to={`/books/${item.book.id}`} className="font-semibold text-edubot-ink hover:text-edubot-orange">
                                    {item.book.title}
                                </Link>
                                <div className="mt-1 text-sm text-edubot-muted">
                                    {item.book.authors?.map((author) => author.name).join(', ') || '-'}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeItem(item.book.id)}
                                    className="mt-3 inline-flex items-center gap-1 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                    Алып салуу
                                </button>
                            </div>
                            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                                <div className="inline-flex overflow-hidden rounded-xl border border-edubot-line">
                                    <button
                                        type="button"
                                        onClick={() => updateQty(item.book.id, item.qty - 1)}
                                        className="grid h-10 w-10 place-items-center bg-white text-edubot-ink hover:bg-edubot-surfaceAlt"
                                        aria-label={`${item.book.title} санын азайтуу`}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        max={item.book.stock || undefined}
                                        value={item.qty}
                                        onChange={(e) => updateQty(item.book.id, Number(e.target.value))}
                                        className="h-10 w-14 border-x border-edubot-line text-center text-sm outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => updateQty(item.book.id, item.qty + 1)}
                                        disabled={Boolean(item.book.stock && item.qty >= item.book.stock)}
                                        className="grid h-10 w-10 place-items-center bg-white text-edubot-ink hover:bg-edubot-surfaceAlt disabled:opacity-40"
                                        aria-label={`${item.book.title} санын көбөйтүү`}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="font-semibold text-edubot-ink">{formatKgs(Number(item.book.price) * item.qty)}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="h-fit rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-card lg:sticky lg:top-28">
                    <div className="mb-4 flex items-center gap-2">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-edubot-orange/10 text-edubot-orange">
                            <BookOpen className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <h2 className="font-semibold text-edubot-ink">Буйрутма жыйынтыгы</h2>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-edubot-muted">Аралык сумма</span>
                        <span className="font-semibold text-edubot-ink">{formatKgs(subtotal)}</span>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-edubot-muted">Жеткирүү акысы жана китептин акыркы бар-жогу телефон же WhatsApp аркылуу такталат.</p>
                    <Link to="/checkout" className="dashboard-button-primary mt-5 flex w-full">
                        Буйрутма берүү
                    </Link>
                    <Link to="/books" className="dashboard-button-secondary mt-3 flex w-full justify-center">
                        Китеп тандоону улантуу
                    </Link>
                </aside>
            </div>
        </main>
    );
}
