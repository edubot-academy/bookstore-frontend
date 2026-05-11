import React from 'react';
import { Eye, Filter, ReceiptText } from 'lucide-react';
import type { OrderDTO, OrderStatus } from '../types';
import Section from '../ui/Section';
import { TextInput, Button } from '../ui/Inputs';
import OrderDetailDrawer from './OrderDetailDrawer';
import { ORDER_STATUSES } from '../types';
import { listOrders } from '../../../lib/api';
import { toStartOfDayISO, toEndOfDayISO } from '../../../lib/utils';
import { getErrorMessage } from '../../../lib/errors';
import { fulfillmentTypeLabel, orderStatusLabel, paymentStatusLabel } from '../../../lib/labels';

function OrdersTab() {
    const [q, setQ] = React.useState('');
    const [status, setStatus] = React.useState<OrderStatus | ''>('');
    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');
    const [page, setPage] = React.useState(1);
    const limit = 20;

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
        } catch (e: unknown) { setError(getErrorMessage(e, 'Буйрутмалар жүктөлгөн жок')); }
        finally { setLoading(false); }
    }, [q, status, dateFrom, dateTo, page, limit]);

    React.useEffect(() => { load(); }, [load]);

    return (
        <div className="space-y-4">
            <Section title="Буйрутмалар" actions={(
                <div className="flex flex-wrap items-center gap-2">
                    <TextInput placeholder="Буйрутма, аты же телефон боюнча издөө" value={q} onChange={(e) => setQ(e.target.value)} className="min-w-[220px]" />
                    <select value={status} onChange={(e) => setStatus((e.target.value || '') as OrderStatus | '')} className="dashboard-select min-w-[160px]">
                        <option value="">Бардык статустар</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{orderStatusLabel(s)}</option>)}
                    </select>
                    <TextInput type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <TextInput type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                    <Button onClick={() => setPage(1)} className="dashboard-button-secondary inline-flex items-center gap-2">
                        <Filter className="h-4 w-4" aria-hidden="true" />
                        Чыпкалоо
                    </Button>
                </div>
            )}>
                {loading ? (
                    <OrdersSkeleton />
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="rounded-2xl border border-edubot-line bg-white/75 p-10 text-center">
                        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                            <ReceiptText className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="font-semibold text-edubot-ink">Буйрутмалар табылган жок</div>
                        <p className="mt-1 text-sm text-edubot-muted">Кардарлар берген жаңы буйрутмалар бул жерде көрүнөт.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full overflow-hidden text-sm">
                            <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Кардар</th>
                                    <th className="px-4 py-3">Алуу жолу</th>
                                    <th className="px-4 py-3">Китептер</th>
                                    <th className="px-4 py-3">Жалпы сумма</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Төлөм</th>
                                    <th className="px-4 py-3">Түзүлгөн</th>
                                    <th className="px-4 py-3 text-right">Аракеттер</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-edubot-line">
                                {rows.map(o => (
                                    <tr key={o.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                        <td className="px-4 py-3 font-semibold text-edubot-ink">{o.number}</td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-edubot-ink">{o.customer.fullName}</div>
                                            <div className="text-xs text-edubot-muted">{o.customer.phone}{o.customer.email ? ` • ${o.customer.email}` : ''}</div>
                                        </td>
                                        <td className="max-w-[240px] truncate px-4 py-3 text-edubot-muted">{fulfillmentTypeLabel(o.delivery.method)}{o.delivery.address ? ` - ${o.delivery.address}` : ''}</td>
                                        <td className="px-4 py-3 text-edubot-muted">{o.items.reduce((a, i) => a + i.qty, 0)} даана</td>
                                        <td className="px-4 py-3 font-semibold text-edubot-ink">{o.totals.currency} {o.totals.total.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={o.status} />
                                        </td>
                                        <td className="px-4 py-3 text-edubot-muted">{paymentStatusLabel(o.paymentStatus || 'UNPAID')}</td>
                                        <td className="px-4 py-3 text-edubot-muted">{new Date(o.createdAt).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button onClick={() => setActive(o)} className="dashboard-button-secondary inline-flex items-center gap-2">
                                                    <Eye className="h-4 w-4" aria-hidden="true" />
                                                    Көрүү
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="dashboard-button-secondary">Мурунку</Button>
                    <div className="rounded-full bg-edubot-surfaceAlt px-3 py-2 text-sm font-medium text-edubot-muted">Бет {page} / {totalPages}</div>
                    <Button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="dashboard-button-secondary">Кийинки</Button>
                </div>
            </Section>

            {active && <OrderDetailDrawer orderId={active.id} onClose={() => setActive(null)} onUpdated={async () => { await load(); }} />}
        </div>
    );
}

export default OrdersTab;

function StatusBadge({ status }: { status: OrderStatus }) {
    const className = status.startsWith('CANCELLED')
        ? 'border-red-200 bg-red-50 text-red-700'
        : status === 'COMPLETED'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700';
    return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{orderStatusLabel(status)}</span>;
}

function OrdersSkeleton() {
    return (
        <div className="space-y-3" aria-label="Буйрутмалар жүктөлүүдө">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 md:grid-cols-[1fr_1.5fr_1fr_1fr]">
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}
