
import React from 'react';
import { BookOpen, PackageCheck, Phone, UserRound, X } from 'lucide-react';
import Section from '../ui/Section';
import { Button, TextArea } from '../ui/Inputs';
import { getOrderAdmin, updateOrderAdmin } from '../../../lib/api';
import type { OrderDTO, OrderStatus, PaymentStatus } from '../types';
import { ORDER_STATUSES } from '../types';
import { fulfillmentTypeLabel, orderStatusLabel, paymentStatusLabel } from '../../../lib/labels';

async function getOrder(id: number) {
    return await getOrderAdmin(id) as OrderDTO;
}
async function updateOrder(id: number, status: OrderStatus, paymentStatus?: PaymentStatus, notes?: string) {
    return await updateOrderAdmin(id, { status, paymentStatus, notes }) as OrderDTO;
}


function OrderDetailDrawer({ orderId, onClose, onUpdated }: { orderId: number; onClose: () => void; onUpdated: () => void | Promise<void> }) {
    const [data, setData] = React.useState<OrderDTO | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [notes, setNotes] = React.useState('');
    const [status, setStatus] = React.useState<OrderStatus>('NEW');
    const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>('UNPAID');

    React.useEffect(() => {
        (async () => {
            try { const o = await getOrder(orderId); setData(o); setNotes(o.notes || ''); setStatus(o.status); setPaymentStatus(o.paymentStatus || 'UNPAID'); }
            finally { setLoading(false); }
        })();
    }, [orderId]);

    const save = async () => {
        if (!data) return; setSaving(true);
        try { await updateOrder(data.id, status, paymentStatus, notes); await onUpdated(); onClose(); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-2xl overflow-y-auto border-l border-edubot-line bg-edubot-surfaceAlt shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-edubot-line bg-white/95 px-5 py-4 backdrop-blur">
                    <div>
                        <div className="text-base font-semibold text-edubot-ink">Буйрутманын маалыматы</div>
                        <div className="text-xs text-edubot-muted">Кардардын буйрутмасын карап, статусун жаңыртыңыз.</div>
                    </div>
                    <Button onClick={onClose} className="grid h-10 w-10 place-items-center border border-edubot-line bg-white text-edubot-ink hover:border-edubot-orange hover:text-edubot-orange" aria-label="Буйрутма маалыматын жабуу">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                {loading || !data ? (
                    <div className="grid gap-4 p-5" aria-label="Буйрутма маалыматы жүктөлүүдө">
                        <div className="h-32 animate-pulse rounded-2xl bg-white" />
                        <div className="h-40 animate-pulse rounded-2xl bg-white" />
                        <div className="h-32 animate-pulse rounded-2xl bg-white" />
                    </div>
                ) : (
                    <div className="grid gap-4 p-5">
                        {/* Header */}
                        <div className="rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">Буйрутма №</div>
                                    <div className="mt-1 text-2xl font-semibold text-edubot-ink">{data.number}</div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">Статус</div>
                                    <div>
                                        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="dashboard-select min-w-[170px]">
                                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{orderStatusLabel(s)}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                                    <div className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">Төлөм</div>
                                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} className="dashboard-select">
                                    <option value="UNPAID">{paymentStatusLabel('UNPAID')}</option>
                                    <option value="PAID">{paymentStatusLabel('PAID')}</option>
                                    <option value="REFUNDED">{paymentStatusLabel('REFUNDED')}</option>
                                    </select>
                                </div>
                                <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">Түзүлгөн</div>
                                    <div className="mt-2 text-sm font-medium text-edubot-ink">{new Date(data.createdAt).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer */}
                        <Section title="Кардар">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-edubot-orange/10 text-edubot-orange">
                                    <UserRound className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <div className="font-semibold text-edubot-ink">{data.customer.fullName}</div>
                                    <div className="mt-1 flex flex-wrap items-center gap-2 text-edubot-muted">
                                        <Phone className="h-4 w-4" aria-hidden="true" />
                                        {data.customer.phone}
                                        {data.customer.email ? <span>{data.customer.email}</span> : null}
                                    </div>
                                </div>
                            </div>
                        </Section>

                        {/* Delivery */}
                        <Section title="Алуу жолу">
                            <div className="rounded-2xl border border-edubot-line bg-white/70 p-4 text-sm text-edubot-ink">
                                <span className="font-semibold">{fulfillmentTypeLabel(data.delivery.method)}</span>
                                {data.delivery.address ? <span className="text-edubot-muted"> - {data.delivery.address}</span> : null}
                            </div>
                        </Section>

                        {/* Items */}
                        <Section title="Китептер">
                            <ul className="divide-y divide-edubot-line">
                                {data.items.map((it, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-3 py-2">
                                        <div className="flex items-center gap-3">
                                            {it.imageUrl ? <img src={it.imageUrl} alt="" className="h-12 w-9 rounded object-cover" /> : <div className="grid h-12 w-9 place-items-center rounded bg-edubot-surface text-edubot-orange"><BookOpen className="h-5 w-5" aria-hidden="true" /></div>}
                                            <div>
                                                <div className="text-sm font-medium text-edubot-ink">{it.title}</div>
                                                <div className="text-xs text-edubot-muted">Саны: {it.qty}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-edubot-ink">{data.totals.currency} {(it.price * it.qty).toFixed(2)}</div>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Totals */}
                        <Section title="Суммалар">
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between"><span className="text-edubot-muted">Аралык сумма</span><span className="text-edubot-ink">{data.totals.currency} {data.totals.subtotal.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between"><span className="text-edubot-muted">Жеткирүү</span><span className="text-edubot-ink">{data.totals.currency} {data.totals.shipping.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between"><span className="text-edubot-muted">Арзандатуу</span><span className="text-edubot-ink">{data.totals.currency} {data.totals.discount.toFixed(2)}</span></div>
                                <div className="mt-3 flex items-center justify-between rounded-2xl bg-edubot-surfaceAlt p-3 text-base font-semibold text-edubot-ink"><span>Жалпы сумма</span><span>{data.totals.currency} {data.totals.total.toFixed(2)}</span></div>
                            </div>
                        </Section>

                        {/* Notes */}
                        <Section title="Эскертүүлөр">
                            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Башкаруу үчүн ички эскертүү..." />
                        </Section>

                        <div className="sticky bottom-0 -mx-5 -mb-5 flex justify-end gap-2 border-t border-edubot-line bg-white/95 p-5 backdrop-blur">
                            <Button onClick={save} disabled={saving} className="dashboard-button-primary inline-flex items-center gap-2">
                                <PackageCheck className="h-4 w-4" aria-hidden="true" />
                                {saving ? 'Сакталып жатат...' : 'Өзгөртүүлөрдү сактоо'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetailDrawer;
