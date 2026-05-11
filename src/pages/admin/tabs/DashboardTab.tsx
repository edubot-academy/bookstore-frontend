import React from 'react';
import { AlertTriangle, BookOpen, PackageCheck, ReceiptText } from 'lucide-react';
import Section from '../ui/Section';
import { getDashboardStats, type DashboardStats } from '../../../lib/api';

function DashboardTab() {
    const [data, setData] = React.useState<DashboardStats | null>(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => { (async () => { try { setData(await getDashboardStats()); } finally { setLoading(false); } })(); }, []);
    if (loading) return <DashboardSkeleton />;
    if (!data) return <div className="rounded-2xl border border-edubot-line bg-white p-8 text-center text-edubot-muted shadow-edubot-soft">Башкы панель үчүн маалымат азырынча жок.</div>;
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard icon={<ReceiptText className="h-5 w-5" aria-hidden="true" />} label="Бүгүнкү буйрутмалар" value={data.todayOrders} tone="orange" />
                <StatCard icon={<PackageCheck className="h-5 w-5" aria-hidden="true" />} label="Бүгүнкү түшүм" value={`${data.todayRevenue?.toFixed?.(2) ?? data.todayRevenue} KGS`} tone="green" />
                <StatCard icon={<BookOpen className="h-5 w-5" aria-hidden="true" />} label="Көп сатылган китеп" value={data.topBooks?.[0]?.title ?? 'Сатуу азырынча жок'} tone="teal" />
                <StatCard icon={<AlertTriangle className="h-5 w-5" aria-hidden="true" />} label="Аз калган китептер" value={data.lowStock?.length ?? 0} tone="warning" />
            </div>
            <Section title="Көп сатылган китептер">
                {data.topBooks?.length ? (
                    <ul className="divide-y divide-edubot-line text-sm">
                        {data.topBooks.map((b, index) => (
                            <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-edubot-orange/10 text-xs font-semibold text-edubot-orange">{index + 1}</span>
                                    <span className="truncate font-medium text-edubot-ink">{b.title}</span>
                                </div>
                                <span className="shrink-0 rounded-full bg-edubot-surfaceAlt px-3 py-1 text-xs font-semibold text-edubot-muted">{b.sold} сатылды</span>
                            </li>
                        ))}
                    </ul>
                ) : <div className="rounded-2xl border border-edubot-line bg-white/70 p-5 text-sm text-edubot-muted">Сатуу азырынча жок.</div>}
            </Section>
            <Section title="Аз калган китептер">
                {data.lowStock?.length ? (
                    <ul className="divide-y divide-edubot-line text-sm">
                        {data.lowStock.map(b => (
                            <li key={b.id} className="flex items-center justify-between gap-3 py-3">
                                <span className="min-w-0 truncate font-medium text-edubot-ink">{b.title}</span>
                                <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{b.stock} калды</span>
                            </li>
                        ))}
                    </ul>
                ) : <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-700">Кампада бардык көзөмөлдөнгөн китептер жетиштүү.</div>}
            </Section>
        </div>
    );
}

export default DashboardTab;


function StatCard({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: React.ReactNode; tone: 'orange' | 'green' | 'teal' | 'warning' }) {
    const toneClass = {
        orange: 'bg-edubot-orange/10 text-edubot-orange',
        green: 'bg-edubot-green/10 text-edubot-green',
        teal: 'bg-edubot-teal/10 text-edubot-teal',
        warning: 'bg-amber-100 text-amber-700',
    }[tone];

    return (
        <div className="rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
            <div className={`mb-4 grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>{icon}</div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">{label}</div>
            <div className="mt-2 line-clamp-2 text-2xl font-semibold text-edubot-ink">{value}</div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="grid gap-4" aria-label="Башкы панель жүктөлүүдө">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
                        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
                        <div className="mt-4 h-3 w-24 animate-pulse rounded bg-slate-100" />
                        <div className="mt-3 h-7 w-28 animate-pulse rounded bg-slate-100" />
                    </div>
                ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
                <div className="h-52 animate-pulse rounded-2xl bg-slate-100" />
            </div>
        </div>
    );
}
