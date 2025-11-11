import React from 'react';
import type { OrderDTO, OrderStatus } from '../types';
import Section from '../ui/Section';
import { TextInput, Button } from '../ui/Inputs';
import OrderDetailDrawer from './OrderDetailDrawer';
import { ORDER_STATUSES } from '../types';
import { listOrders } from '../../../lib/api';
import { toStartOfDayISO, toEndOfDayISO } from '../../../lib/utils';

// async function listOrders(params?: { q?: string; status?: OrderStatus | ''; dateFrom?: string; dateTo?: string; page?: number; limit?: number }) {
//     const { data } = await api.get('/admin/orders', { params });
//     return (data as any) as { items: OrderDTO[]; total: number; page: number; limit: number; totalPages: number } | OrderDTO[];
// }

function OrdersTab() {
    const [q, setQ] = React.useState('');
    const [status, setStatus] = React.useState<OrderStatus | ''>('');
    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(20);

    const [rows, setRows] = React.useState<OrderDTO[]>([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [active, setActive] = React.useState<OrderDTO | null>(null);

    const load = React.useCallback(async () => {
        setLoading(true); setError(null);
        try {
            const data = await listOrders({
                q,
                status,
                dateFrom: toStartOfDayISO(dateFrom),   // ✅ convert to ISO
                dateTo: toEndOfDayISO(dateTo),         // ✅ convert to ISO
                page,
                limit
            });
            if (Array.isArray(data)) { setRows(data); setTotalPages(1); }
            else { setRows(data.items); setTotalPages(data.totalPages || 1); }
        } catch (e: any) { setError(e?.message || 'Failed to load orders'); }
        finally { setLoading(false); }
    }, [q, status, dateFrom, dateTo, page, limit]);

    React.useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-4">
            <Section title="Orders" actions={(
                <div className="flex flex-wrap items-center gap-2">
                    <TextInput placeholder="Search #number, name, phone" value={q} onChange={(e) => setQ(e.target.value)} />
                    <select value={status as any} onChange={(e) => setStatus((e.target.value || '') as any)} className="rounded border border-border px-2 py-2 text-sm">
                        <option value="">All statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <TextInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <TextInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    <Button onClick={() => setPage(1)} className="border border-border bg-white text-dark">Filter</Button>
                </div>
            )}>
                {loading ? (
                    <div className="py-10 text-center text-text-muted">Loading…</div>
                ) : error ? (
                    <div className="py-10 text-center text-red-600">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="py-10 text-center text-text-muted">No orders.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-border text-left text-text-muted">
                                <tr>
                                    <th className="px-3 py-2">#</th>
                                    <th className="px-3 py-2">Customer</th>
                                    <th className="px-3 py-2">Delivery</th>
                                    <th className="px-3 py-2">Items</th>
                                    <th className="px-3 py-2">Total</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Created</th>
                                    <th className="px-3 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(o => (
                                    <tr key={o.id} className="border-b border-border">
                                        <td className="px-3 py-2 font-medium text-dark">{o.number}</td>
                                        <td className="px-3 py-2">
                                            <div className="text-dark">{o.customer.fullName}</div>
                                            <div className="text-xs text-text-muted">{o.customer.phone}{o.customer.email ? ` • ${o.customer.email}` : ''}</div>
                                        </td>
                                        <td className="px-3 py-2 text-text-muted">{o.delivery.method}{o.delivery.address ? ` — ${o.delivery.address}` : ''}</td>
                                        <td className="px-3 py-2 text-text-muted">{o.items.reduce((a, i) => a + i.qty, 0)} items</td>
                                        <td className="px-3 py-2">{o.totals.currency} {o.totals.total.toFixed(2)}</td>
                                        <td className="px-3 py-2">
                                            <span className={`rounded px-2 py-0.5 text-xs ${o.status === 'CANCELLED' ? 'bg-red-50 text-red-700 border border-red-200' : o.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{o.status}</span>
                                        </td>
                                        <td className="px-3 py-2 text-text-muted">{new Date(o.createdAt).toLocaleString()}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button onClick={() => setActive(o)} className="border border-border bg-white text-dark">View</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="border border-border bg-white text-dark">←</Button>
                    <div className="text-sm text-text-muted">Page {page} / {totalPages}</div>
                    <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="border border-border bg-white text-dark">→</Button>
                </div>
            </Section>

            {active && <OrderDetailDrawer orderId={active.id} onClose={() => setActive(null)} onUpdated={async () => { await load(); }} />}
        </div>
    );
}

export default OrdersTab;