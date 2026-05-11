import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { MessageCircle, PackageCheck, ShoppingBag } from 'lucide-react';
import { availabilityLabel, bookTypeLabel, stockText } from '../lib/labels';
import { whatsappUrl } from '../lib/business';
import SEO from '../components/SEO';

export default function BookPage() {
    const { id } = useParams();
    const { addItem } = useCart();
    const { data, isLoading } = useQuery({ queryKey: ['book', id], queryFn: () => getBook(Number(id)) });
    if (isLoading) return <BookPageSkeleton />;
    if (!data) return <div className="mx-auto max-w-4xl px-4 py-12 text-center text-edubot-muted">Китеп табылган жок.</div>;
    const b = data;
    const authors = b.authors?.map((author) => author.name).join(', ') || '-';
    const stock = b.stock ?? 0;
    const availability = availabilityLabel(stock);
    const whatsappText = `Саламатсызбы, "${b.title}" китеби боюнча суроом бар.`;
    const bookSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: b.title,
        description: b.description || `${b.title} китеби EduBook каталогунда.`,
        image: b.coverUrl,
        brand: b.publisher || 'EduBook',
        offers: {
            "@type": "Offer",
            priceCurrency: "KGS",
            price: Number(b.price),
            availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    };
    return (
        <main className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-[360px_1fr_280px]">
            <SEO
                title={`${b.title} - окуу китеби`}
                description={`${b.title} китебин EduBook каталогунан караңыз. Баасы, деңгээли, тили жана кампада болушу боюнча маалымат.`}
                path={`/books/${b.id}`}
                image={b.coverUrl || "/bookstore_logo.svg"}
                type="product"
                structuredData={bookSchema}
            />
            <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-edubot-line bg-edubot-surface shadow-edubot-card">
                <img
                    src={b.coverUrl || 'https://placehold.co/480x640?text=Китеп'}
                    alt={b.title}
                    className="h-full w-full object-cover"
                />
            </div>
            <div>
                <div className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-edubot-orange">{b.category?.name ?? 'Категория жок'}</div>
                <h1 className="text-3xl font-semibold text-edubot-ink">{b.title}</h1>
                <p className="mt-2 text-edubot-muted">{authors}</p>
                <p className="mt-4 text-2xl font-bold text-primary">{Number(b.price).toLocaleString()} KGS</p>
                <p className={`mt-2 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${stock <= 0 ? 'border-red-200 bg-red-50 text-red-700' : stock <= 3 ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                    {availability}{stock > 0 ? ` / ${stockText(stock)}` : ''}
                </p>
                <p className="mt-6 whitespace-pre-line leading-7 text-edubot-ink">{b.description || 'Сыпаттама азырынча жок.'}</p>

                <dl className="mt-6 grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 text-sm shadow-edubot-soft sm:grid-cols-2">
                    {b.subject && <Meta label="Предмет" value={b.subject} />}
                    {b.language && <Meta label="Тил" value={b.language} />}
                    {b.gradeLevel && <Meta label="Класс / деңгээл" value={b.gradeLevel} />}
                    {b.bookType && <Meta label="Китеп түрү" value={bookTypeLabel(b.bookType)} />}
                    {b.publisher && <Meta label="Басмакана" value={b.publisher} />}
                    {b.edition && <Meta label="Басылышы" value={b.edition} />}
                    {b.isbn && <Meta label="ISBN" value={b.isbn} />}
                </dl>

                {b.targetAudience && (
                    <section className="mt-6 rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
                        <h2 className="text-sm font-semibold text-edubot-ink">Кимдер үчүн ылайыктуу</h2>
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-edubot-muted">{b.targetAudience}</p>
                    </section>
                )}

            </div>

            <aside className="h-fit rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-card lg:sticky lg:top-28">
                <div className="text-sm text-edubot-muted">Баасы</div>
                <div className="mt-1 text-2xl font-bold text-primary">{Number(b.price).toLocaleString()} KGS</div>
                <div className="mt-4 grid gap-2 text-sm text-edubot-muted">
                    <div className="flex items-center gap-2"><PackageCheck size={16} className="text-edubot-green" /> Өзү алып кетүү же жеткирүү</div>
                    <div className="flex items-center gap-2"><MessageCircle size={16} className="text-edubot-green" /> Буйрутма кол менен ырасталат</div>
                </div>
                <div className="mt-5 grid gap-3">
                    <button
                        type="button"
                        disabled={stock <= 0}
                        onClick={() => addItem(b)}
                        className="dashboard-button-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <ShoppingBag size={16} /> Себетке кошуу
                    </button>
                    <a
                        href={whatsappUrl(whatsappText)}
                        target="_blank"
                        rel="noreferrer"
                        className="dashboard-button-secondary inline-flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={16} /> WhatsApp аркылуу суроо
                    </a>
                </div>
                <p className="mt-4 text-xs leading-5 text-edubot-muted">
                    Буйрутма берилгенден кийин китептин бар-жогун жана алуу жолун командабыз тактайт.
                </p>
            </aside>
        </main>
    );
}

function Meta({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <dt className="text-edubot-muted">{label}</dt>
            <dd className="font-medium text-edubot-ink">{value}</dd>
        </div>
    );
}

function BookPageSkeleton() {
    return (
        <main className="mx-auto grid max-w-6xl gap-8 p-6 lg:grid-cols-[360px_1fr_280px]" aria-label="Китеп жүктөлүүдө">
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-slate-100" />
            <div className="space-y-4">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                <div className="h-9 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-5 w-48 animate-pulse rounded bg-slate-100" />
                <div className="h-7 w-28 animate-pulse rounded bg-slate-100" />
                <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
            </div>
            <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
        </main>
    );
}
