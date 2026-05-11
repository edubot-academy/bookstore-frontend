import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createOrder } from '../lib/api';
import { useCart } from '../hooks/useCart';
import { CheckCircle2, MapPin, Phone, ShoppingBag } from 'lucide-react';
import { getErrorMessage } from '../lib/errors';
import { fulfillmentTypeLabel, paymentMethodLabel } from '../lib/labels';
import { BUSINESS } from '../lib/business';

type FulfillmentType = 'PICKUP' | 'DELIVERY';
type PaymentMethod = 'CASH' | 'TRANSFER';

const formatKgs = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(value);

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, subtotal, clearCart } = useCart();
    const [fullName, setFullName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [fulfillmentType, setFulfillmentType] = React.useState<FulfillmentType>('PICKUP');
    const [line1, setLine1] = React.useState('');
    const [city, setCity] = React.useState('Бишкек');
    const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('CASH');
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        if (items.length === 0) {
            setError('Себетиңиз бош.');
            return;
        }
        if (fulfillmentType === 'DELIVERY' && !line1.trim()) {
            setError('Жеткирүү дарегин жазыңыз.');
            return;
        }

        setSubmitting(true);
        try {
            const order = await createOrder({
                items: items.map((item) => ({ bookId: item.book.id, qty: item.qty })),
                fulfillmentType,
                contact: {
                    fullName: fullName.trim(),
                    phone: phone.trim(),
                    email: email.trim() || undefined,
                },
                deliveryAddress: fulfillmentType === 'DELIVERY'
                    ? { line1: line1.trim(), city: city.trim() || undefined }
                    : undefined,
                paymentMethod,
            });
            clearCart();
            const token = order.publicAccessToken ? `?token=${encodeURIComponent(order.publicAccessToken)}` : '';
            navigate(`/order-success/${order.orderNumber || order.number}${token}`);
        } catch (e) {
            setError(getErrorMessage(e, 'Буйрутма түзүлгөн жок.'));
        } finally {
            setSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12 text-center">
                <div className="rounded-2xl border border-edubot-line bg-white p-8 shadow-edubot-card">
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                        <ShoppingBag className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl font-semibold text-edubot-ink">Буйрутма берүү</h1>
                    <p className="mt-3 text-edubot-muted">Себетиңиз бош.</p>
                    <Link to="/books" className="dashboard-button-primary mt-6">Китептерди көрүү</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">EduBook буйрутмасы</p>
                    <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">Буйрутма берүү</h1>
                    <p className="mt-2 text-sm text-edubot-muted">Буйрутмаңызды жөнөтүңүз. Командабыз китептин бар-жогун жана алуу жолун тактайт.</p>
                </div>
                <div className="rounded-full border border-edubot-line bg-edubot-surfaceAlt px-4 py-2 text-xs font-semibold text-edubot-muted">
                    Азыр онлайн төлөм талап кылынбайт
                </div>
            </div>
            <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="space-y-5 rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-card">
                    <CheckoutStep number="1" title="Байланыш" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="grid gap-1 text-sm">
                            <span className="font-semibold text-edubot-ink">Толук аты-жөнү</span>
                            <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="dashboard-field" />
                        </label>
                        <label className="grid gap-1 text-sm">
                            <span className="font-semibold text-edubot-ink">Телефон номери</span>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} required className="dashboard-field" />
                        </label>
                    </div>

                    <label className="grid gap-1 text-sm">
                        <span className="font-semibold text-edubot-ink">Email (милдеттүү эмес)</span>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="dashboard-field" />
                    </label>

                    <div>
                        <CheckoutStep number="2" title="Алуу жолу" />
                        <div className="mb-2 text-sm font-semibold text-edubot-ink">Алуу жолу</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {(['PICKUP', 'DELIVERY'] as FulfillmentType[]).map((value) => (
                                <label key={value} className={`flex items-center gap-2 rounded-2xl border p-3 text-sm transition ${fulfillmentType === value ? 'border-edubot-orange bg-edubot-orange/10' : 'border-edubot-line bg-white'}`}>
                                    <input type="radio" checked={fulfillmentType === value} onChange={() => setFulfillmentType(value)} className="accent-primary" />
                                    <span>
                                        <span className="block font-medium text-edubot-ink">{fulfillmentTypeLabel(value)}</span>
                                        <span className="text-xs text-edubot-muted">{value === 'PICKUP' ? BUSINESS.address : 'Дарек телефон аркылуу такталат'}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {fulfillmentType === 'DELIVERY' && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-1 text-sm sm:col-span-2">
                                <span className="font-semibold text-edubot-ink">Жеткирүү дареги</span>
                                <input value={line1} onChange={(e) => setLine1(e.target.value)} required className="dashboard-field" />
                            </label>
                            <label className="grid gap-1 text-sm">
                                <span className="font-semibold text-edubot-ink">Шаар</span>
                                <input value={city} onChange={(e) => setCity(e.target.value)} className="dashboard-field" />
                            </label>
                        </div>
                    )}

                    <div>
                        <CheckoutStep number="3" title="Төлөм" />
                        <div className="mb-2 text-sm font-semibold text-edubot-ink">Төлөм</div>
                        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="dashboard-select">
                            <option value="CASH">{paymentMethodLabel('CASH')}</option>
                            <option value="TRANSFER">{paymentMethodLabel('TRANSFER')}</option>
                        </select>
                    </div>

                    {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
                </div>

                <aside className="h-fit rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-card lg:sticky lg:top-28">
                    <h2 className="font-semibold text-edubot-ink">Буйрутма жыйынтыгы</h2>
                    <ul className="mt-4 space-y-3">
                        {items.map((item) => (
                            <li key={item.book.id} className="flex justify-between gap-3 text-sm">
                                <span className="text-edubot-muted">{item.book.title} x {item.qty}</span>
                                <span className="font-medium text-edubot-ink">{formatKgs(Number(item.book.price) * item.qty)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 border-t border-edubot-line pt-4">
                        <div className="flex justify-between">
                            <span className="text-edubot-muted">Жалпы сумма</span>
                            <span className="font-semibold text-edubot-ink">{formatKgs(subtotal)}</span>
                        </div>
                    </div>
                    <button type="submit" disabled={submitting} className="dashboard-button-primary mt-5 w-full">
                        {submitting ? 'Буйрутма түзүлүүдө...' : 'Буйрутма берүү'}
                    </button>
                    <div className="mt-5 grid gap-2 border-t border-edubot-line pt-4 text-xs leading-5 text-edubot-muted">
                        <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-edubot-green" /> Себет буйрутма түзүлгөндөн кийин гана тазаланат.</div>
                        <div className="flex items-center gap-2"><Phone size={15} className="text-edubot-green" /> Телефон же WhatsApp аркылуу ырастайбыз.</div>
                        <div className="flex items-center gap-2"><MapPin size={15} className="text-edubot-green" /> Алып кетүү маалыматы буйрутмада көрсөтүлөт.</div>
                    </div>
                </aside>
            </form>
        </main>
    );
}

function CheckoutStep({ number, title }: { number: string; title: string }) {
    return (
        <div className="mb-3 flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-edubot-orange text-xs font-bold text-white">{number}</span>
            <span className="text-sm font-semibold uppercase tracking-wide text-edubot-dark">{title}</span>
        </div>
    );
}
