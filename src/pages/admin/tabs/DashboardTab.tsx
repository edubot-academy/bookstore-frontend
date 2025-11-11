import React from 'react';
import Section from '../ui/Section';
import { api } from '../../../lib/api';

async function getStats() {
    const { data } = await api.get('/admin/stats');
    return data as { todayOrders: number; todayRevenue: number; topBooks: Array<{ id: number; title: string; sold: number }>; lowStock: Array<{ id: number; title: string; stock: number }>; };
}

function DashboardTab() {
    const [data, setData] = React.useState<{ todayOrders: number; todayRevenue: number; topBooks: Array<{ id: number; title: string; sold: number }>; lowStock: Array<{ id: number; title: string; stock: number }>; } | null>(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => { (async () => { try { setData(await getStats()); } finally { setLoading(false); } })(); }, []);
    if (loading) return <div className="text-text-muted">Loading…</div>;
    if (!data) return <div className="text-text-muted">No data.</div>;
    return (
        <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <StatCard label="Today's Orders" value={data.todayOrders} />
                <StatCard label="Today's Revenue" value={`$${data.todayRevenue?.toFixed?.(2) ?? data.todayRevenue}`} />
                <StatCard label="Top Book" value={data.topBooks?.[0]?.title ?? '—'} />
                <StatCard label="Low Stock" value={data.lowStock?.length ?? 0} />
            </div>
            <Section title="Top Books">
                {data.topBooks?.length ? (
                    <ul className="list-disc pl-5 text-sm text-dark">
                        {data.topBooks.map(b => <li key={b.id}>{b.title} <span className="text-text-muted">— {b.sold} sold</span></li>)}
                    </ul>
                ) : <div className="text-text-muted">No sales yet.</div>}
            </Section>
            <Section title="Low Stock">
                {data.lowStock?.length ? (
                    <ul className="list-disc pl-5 text-sm text-dark">
                        {data.lowStock.map(b => <li key={b.id}>{b.title} <span className="text-text-muted">— {b.stock} left</span></li>)}
                    </ul>
                ) : <div className="text-text-muted">All good.</div>}
            </Section>
        </div>
    );
}

export default DashboardTab;


function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-border bg-white p-4">
            <div className="text-sm text-text-muted">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-dark">{value}</div>
        </div>
    );
}
