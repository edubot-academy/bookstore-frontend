import React from 'react';
import { BookOpen, Layers, PackageCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { listBundles, type BundleDTO } from '../lib/api';
import EmptyState from '../components/EmptyState';

export default function BundlesPage() {
    const [bundles, setBundles] = React.useState<BundleDTO[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let mounted = true;
        listBundles()
            .then((data) => { if (mounted) setBundles(data); })
            .catch((e) => { if (mounted) setError(e instanceof Error ? e.message : 'Топтомдор жүктөлгөн жок'); })
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, []);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <div className="mb-7 rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">EduBook окуу топтомдору</p>
                        <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">Курс китеп топтомдору</h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-edubot-muted">
                            Белгилүү окуу багыттары үчүн тандалган китептер жана материалдар. Азырынча топтомдордогу китептер учурдагы жеке баасы менен эсептелет.
                        </p>
                    </div>
                    <div className="grid gap-3 text-sm text-edubot-muted sm:grid-cols-3 lg:w-[460px]">
                        <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                            <Layers className="mb-2 h-5 w-5 text-edubot-teal" aria-hidden="true" />
                            Курска ылайык
                        </div>
                        <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                            <BookOpen className="mb-2 h-5 w-5 text-edubot-orange" aria-hidden="true" />
                            Китеп негизинде
                        </div>
                        <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                            <PackageCheck className="mb-2 h-5 w-5 text-edubot-green" aria-hidden="true" />
                            Кол менен ырастоо
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <BundleGridSkeleton />
            ) : error ? (
                <EmptyState
                    title="Топтомдор жүктөлгөн жок"
                    description={error}
                    className="border-red-200 bg-red-50 text-red-700 shadow-none"
                />
            ) : bundles.length === 0 ? (
                <EmptyState
                    title="Активдүү топтомдор азырынча жок"
                    description="EduBook азыр жеке китептерди сата алат. Курс топтомдору башкаруу панелиндеги контент даяр болгондо жарыяланат."
                    action={<Link to="/catalog" className="dashboard-button-primary">Каталогду көрүү</Link>}
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {bundles.map((bundle) => (
                        <BundleCard key={bundle.id} bundle={bundle} />
                    ))}
                </div>
            )}
        </main>
    );
}

function BundleCard({ bundle }: { bundle: BundleDTO }) {
    const includedBooksTotal = bundle.items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);
    return (
        <Link to={`/bundles/${bundle.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-edubot-line bg-white shadow-edubot-soft transition hover:-translate-y-1 hover:border-edubot-orange/50 hover:shadow-edubot-hover-soft">
            {bundle.image ? (
                <img src={bundle.image} alt={bundle.title} className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
            ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center bg-edubot-surface text-edubot-orange">
                    <BookOpen className="h-12 w-12" aria-hidden="true" />
                </div>
            )}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-edubot-teal/10 px-3 py-1 text-xs font-semibold text-edubot-teal">
                        {bundle.items.length} китеп
                    </span>
                    <span className="rounded-full bg-edubot-orange/10 px-3 py-1 text-xs font-semibold text-edubot-orange">
                        Учурдагы баалар
                    </span>
                </div>
                <h2 className="text-lg font-semibold text-edubot-ink">{bundle.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-edubot-muted">{bundle.description || 'Белгилүү окуу багыты үчүн тандалган EduBook топтому.'}</p>
                <div className="mt-auto pt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">Китептердин суммасы</div>
                    <div className="mt-1 text-xl font-semibold text-edubot-ink">{includedBooksTotal.toFixed(2)} KGS</div>
                </div>
            </div>
        </Link>
    );
}

function BundleGridSkeleton() {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Топтомдор жүктөлүүдө">
            {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-edubot-line bg-white shadow-edubot-soft">
                    <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                    <div className="space-y-3 p-5">
                        <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                        <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                        <div className="h-6 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                </div>
            ))}
        </div>
    );
}
