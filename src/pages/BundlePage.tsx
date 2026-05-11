import React from 'react';
import { ArrowLeft, BookOpen, PackageCheck, ShoppingBag } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getBundle, type BundleDTO } from '../lib/api';
import { useCart } from '../hooks/useCart';
import EmptyState from '../components/EmptyState';

export default function BundlePage() {
    const { id } = useParams();
    const { addItem } = useCart();
    const [bundle, setBundle] = React.useState<BundleDTO | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [added, setAdded] = React.useState(false);

    React.useEffect(() => {
        const bundleId = Number(id);
        if (!bundleId) {
            setError('Топтом табылган жок');
            setLoading(false);
            return;
        }
        getBundle(bundleId)
            .then(setBundle)
            .catch((e) => setError(e instanceof Error ? e.message : 'Топтом жүктөлгөн жок'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <BundleDetailSkeleton />;
    if (error || !bundle) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12">
                <EmptyState
                    title="Топтом табылган жок"
                    description={error || 'Бул топтом азыр активдүү эмес же жеткиликтүү эмес болушу мүмкүн.'}
                    action={<Link to="/bundles" className="dashboard-button-primary">Топтомдорго кайтуу</Link>}
                />
            </main>
        );
    }

    const includedBooksTotal = bundle.items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);

    const addBundleToCart = () => {
        if (bundle.items.length === 0) return;
        bundle.items.forEach((item) => addItem(item.book, item.quantity));
        setAdded(true);
        window.setTimeout(() => setAdded(false), 2500);
    };

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                <div className="lg:sticky lg:top-24 lg:self-start">
                    {bundle.image ? (
                        <img src={bundle.image} alt={bundle.title} className="aspect-[4/3] w-full rounded-2xl border border-edubot-line object-cover shadow-edubot-card" />
                    ) : (
                        <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-edubot-line bg-edubot-surface text-edubot-orange shadow-edubot-card">
                            <BookOpen className="h-16 w-16" aria-hidden="true" />
                        </div>
                    )}
                </div>
                <div>
                    <Link to="/bundles" className="inline-flex items-center gap-2 text-sm font-medium text-edubot-muted hover:text-edubot-orange">
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        Топтомдорго кайтуу
                    </Link>
                    <div className="mt-4 rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card">
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">Курс топтому</p>
                        <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">{bundle.title}</h1>
                        <p className="mt-3 text-sm leading-6 text-edubot-muted">{bundle.description || 'Белгилүү окуу багыты үчүн тандалган EduBook топтому.'}</p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4">
                                <BookOpen className="mb-2 h-5 w-5 text-edubot-orange" aria-hidden="true" />
                                <div className="text-lg font-semibold text-edubot-ink">{bundle.items.length}</div>
                                <div className="text-xs text-edubot-muted">Китеп кирет</div>
                            </div>
                            <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4">
                                <ShoppingBag className="mb-2 h-5 w-5 text-edubot-teal" aria-hidden="true" />
                                <div className="text-lg font-semibold text-edubot-ink">{includedBooksTotal.toFixed(2)} KGS</div>
                                <div className="text-xs text-edubot-muted">Китептердин суммасы</div>
                            </div>
                            <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4">
                                <PackageCheck className="mb-2 h-5 w-5 text-edubot-green" aria-hidden="true" />
                                <div className="text-lg font-semibold text-edubot-ink">Кол менен</div>
                                <div className="text-xs text-edubot-muted">Буйрутманы ырастоо</div>
                            </div>
                        </div>

                        <div className="mt-6 rounded-2xl border border-edubot-orange/20 bg-edubot-orange/10 p-4 text-sm leading-6 text-edubot-ink">
                            Топтомдогу китептер себетке өз-өзүнчө, учурдагы баасы менен кошулат. Топтомго өзүнчө баа жана арзандатуу кийинки жаңыртууга калтырылган.
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <button
                                type="button"
                                onClick={addBundleToCart}
                                disabled={bundle.items.length === 0}
                                className="dashboard-button-primary min-h-[48px]"
                            >
                                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                                Топтом китептерин себетке кошуу
                            </button>
                            <Link to="/cart" className="dashboard-button-secondary inline-flex min-h-[48px] items-center justify-center">Себетти көрүү</Link>
                            {added && <span className="text-sm font-medium text-edubot-green">Топтом китептери кошулду.</span>}
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-10">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-edubot-ink">Топтомдогу китептер</h2>
                    <span className="rounded-full bg-edubot-teal/10 px-3 py-1 text-xs font-semibold text-edubot-teal">{bundle.items.length} даана</span>
                </div>
                {bundle.items.length === 0 ? (
                    <EmptyState title="Бул топтомдо китеп жок" description="Топтом жарыяланган, бирок ичинде китептер азырынча жок." />
                ) : (
                    <div className="grid gap-3">
                        {bundle.items.map((item) => (
                            <Link key={item.id} to={`/books/${item.book.id}`} className="grid gap-4 rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft transition hover:-translate-y-0.5 hover:border-edubot-orange/50 hover:shadow-edubot-hover-soft md:grid-cols-[76px_1fr_auto]">
                                <div className="h-24 w-[76px] overflow-hidden rounded-xl bg-edubot-surface">
                                    {item.book.coverUrl ? (
                                        <img src={item.book.coverUrl} alt={item.book.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-edubot-orange">
                                            <BookOpen className="h-8 w-8" aria-hidden="true" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-edubot-ink">{item.book.title}</h3>
                                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-edubot-muted">{item.book.description}</p>
                                    <div className="mt-2 text-sm font-semibold text-edubot-ink">{Number(item.book.price).toFixed(2)} KGS</div>
                                </div>
                                <div className="self-start rounded-full bg-edubot-surfaceAlt px-3 py-1 text-sm font-semibold text-edubot-muted">Саны {item.quantity}</div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

function BundleDetailSkeleton() {
    return (
        <main className="mx-auto max-w-6xl px-4 py-8" aria-label="Топтом жүктөлүүдө">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
                <div className="aspect-[4/3] animate-pulse rounded-2xl bg-slate-100" />
                <div className="rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                    <div className="mt-4 h-9 w-3/4 animate-pulse rounded bg-slate-100" />
                    <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
                    <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                        ))}
                    </div>
                    <div className="mt-6 h-12 w-48 animate-pulse rounded-2xl bg-slate-100" />
                </div>
            </div>
        </main>
    );
}
