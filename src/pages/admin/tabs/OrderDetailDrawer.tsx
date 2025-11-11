
import React from 'react';
import Section from '../ui/Section';
import { Button, TextArea } from '../ui/Inputs';
import { api } from '../../../lib/api';
import type { OrderDTO, OrderStatus } from '../types';
import { ORDER_STATUSES } from '../types';

async function getOrder(id: number) {
    const { data } = await api.get(`/admin/orders/${id}`);
    return data as OrderDTO;
}
async function updateOrder(id: number, body: Partial<OrderDTO> & { status?: OrderStatus; notes?: string; trackingCode?: string }) {
    const { data } = await api.patch(`/admin/orders/${id}`, body);
    return data as OrderDTO;
}


function OrderDetailDrawer({ orderId, onClose, onUpdated }: { orderId: number; onClose: () => void; onUpdated: () => void | Promise<void> }) {
    const [data, setData] = React.useState<OrderDTO | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [notes, setNotes] = React.useState('');
    const [status, setStatus] = React.useState<OrderStatus>('NEW');

    React.useEffect(() => {
        (async () => {
            try { const o = await getOrder(orderId); setData(o); setNotes(o.notes || ''); setStatus(o.status); }
            finally { setLoading(false); }
        })();
    }, [orderId]);

    const save = async () => {
        if (!data) return; setSaving(true);
        try { await updateOrder(data.id, { status, notes }); await onUpdated(); onClose(); }
        finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-border bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="text-base font-semibold text-dark">Order Details</div>
                    <Button onClick={onClose} className="text-dark/70 hover:bg-neutral/50">✕</Button>
                </div>
                {loading || !data ? (
                    <div className="p-4 text-text-muted">Loading…</div>
                ) : (
                    <div className="grid gap-4 p-4">
                        {/* Header */}
                        <div className="rounded border border-border p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <div className="text-sm text-text-muted">Order #</div>
                                    <div className="text-lg font-semibold text-dark">{data.number}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-text-muted">Status</div>
                                    <div>
                                        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="rounded border border-border px-2 py-1 text-sm">
                                            {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Customer */}
                        <Section title="Customer">
                            <div className="text-sm">
                                <div className="font-medium text-dark">{data.customer.fullName}</div>
                                <div className="text-text-muted">{data.customer.phone}{data.customer.email ? ` • ${data.customer.email}` : ''}</div>
                            </div>
                        </Section>

                        {/* Delivery */}
                        <Section title="Delivery">
                            <div className="text-sm text-dark">{data.delivery.method}{data.delivery.address ? ` — ${data.delivery.address}` : ''}</div>
                        </Section>

                        {/* Items */}
                        <Section title="Items">
                            <ul className="divide-y divide-border">
                                {data.items.map((it, idx) => (
                                    <li key={idx} className="flex items-center justify-between gap-3 py-2">
                                        <div className="flex items-center gap-3">
                                            {it.imageUrl ? <img src={it.imageUrl} className="h-10 w-8 rounded object-cover" /> : <div className="h-10 w-8 rounded bg-neutral/50" />}
                                            <div>
                                                <div className="text-sm font-medium text-dark">{it.title}</div>
                                                <div className="text-xs text-text-muted">Qty: {it.qty}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-semibold text-dark">{data.totals.currency} {(it.price * it.qty).toFixed(2)}</div>
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* Totals */}
                        <Section title="Totals">
                            <div className="space-y-1 text-sm">
                                <div className="flex items-center justify-between"><span className="text-text-muted">Subtotal</span><span className="text-dark">{data.totals.currency} {data.totals.subtotal.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between"><span className="text-text-muted">Shipping</span><span className="text-dark">{data.totals.currency} {data.totals.shipping.toFixed(2)}</span></div>
                                <div className="flex items-center justify-between"><span className="text-text-muted">Discount</span><span className="text-dark">{data.totals.currency} {data.totals.discount.toFixed(2)}</span></div>
                                <div className="mt-2 flex items-center justify-between text-base font-semibold"><span>Total</span><span>{data.totals.currency} {data.totals.total.toFixed(2)}</span></div>
                            </div>
                        </Section>

                        {/* Notes */}
                        <Section title="Notes">
                            <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
                        </Section>

                        <div className="flex justify-end gap-2">
                            <Button onClick={save} disabled={saving} className="bg-dark text-white">{saving ? 'Saving…' : 'Save Changes'}</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderDetailDrawer;
