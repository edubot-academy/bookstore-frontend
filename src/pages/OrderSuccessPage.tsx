import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../lib/api';
import type { OrderDTO } from './admin/types';
import { CheckCircle2, MessageCircle, PackageCheck, Phone } from 'lucide-react';
import { fulfillmentTypeLabel } from '../lib/labels';
import { whatsappUrl } from '../lib/business';

const formatKgs = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KGS', maximumFractionDigits: 0 }).format(value);

export default function OrderSuccessPage() {
    const { orderNumber } = useParams();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const { data, isLoading, isError } = useQuery({
        queryKey: ['order-success', orderNumber, token],
        queryFn: () => getOrder(orderNumber || '', token) as Promise<OrderDTO>,
        enabled: Boolean(orderNumber),
    });

    const whatsappText = `Саламатсызбы, менин буйрутмам: ${orderNumber}`;

    return (
        <main className="mx-auto max-w-4xl px-4 py-12">
            <div className="rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card">
                <div className="flex flex-wrap items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-edubot-green/10 text-edubot-green">
                        <CheckCircle2 size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-semibold text-edubot-ink">Буйрутма кабыл алынды</h1>
                        <p className="mt-3 text-edubot-muted">Жакын арада сиз менен байланышып, китептин бар-жогун жана алуу жолун тактайбыз.</p>
                    </div>
                </div>
                <div className="mt-5 rounded-2xl bg-edubot-surfaceAlt p-4">
                    <div className="text-sm text-edubot-muted">Буйрутма номери</div>
                    <div className="text-xl font-semibold text-edubot-ink">{orderNumber}</div>
                </div>

                <div className="mt-5 grid gap-3 rounded-xl border border-edubot-line bg-edubot-surfaceAlt p-4 text-sm text-edubot-muted sm:grid-cols-3">
                    <div className="flex items-center gap-2"><Phone size={16} className="text-edubot-green" /> Телефон аркылуу ырастоо</div>
                    <div className="flex items-center gap-2"><MessageCircle size={16} className="text-edubot-green" /> WhatsApp бар</div>
                    <div className="flex items-center gap-2"><PackageCheck size={16} className="text-edubot-green" /> Өзү алып кетүү же жеткирүү</div>
                </div>

                {isLoading ? (
                    <div className="mt-6 rounded-2xl border border-edubot-line bg-white p-4 text-edubot-muted">Буйрутма маалыматы жүктөлүүдө...</div>
                ) : isError || !data ? (
                    <div className="mt-6 rounded-2xl border border-edubot-line bg-white p-4 text-edubot-muted">Буйрутма маалыматы азыр жеткиликтүү эмес.</div>
                ) : (
                    <div className="mt-6 grid gap-5">
                        <section>
                            <h2 className="font-semibold text-edubot-ink">Кардар</h2>
                            <p className="mt-1 text-sm text-edubot-muted">{data.customer.fullName} - {data.customer.phone}</p>
                        </section>
                        <section>
                            <h2 className="font-semibold text-edubot-ink">Китептер</h2>
                            <ul className="mt-2 divide-y divide-edubot-line overflow-hidden rounded-2xl border border-edubot-line">
                                {data.items.map((item) => (
                                    <li key={`${item.bookId}-${item.title}`} className="flex justify-between gap-3 p-3 text-sm">
                                        <span className="text-edubot-muted">{item.title} x {item.qty}</span>
                                        <span className="font-medium text-edubot-ink">{formatKgs(item.price * item.qty)}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                        <section className="flex flex-wrap justify-between gap-3">
                            <div>
                                <h2 className="font-semibold text-edubot-ink">Алуу жолу</h2>
                                <p className="mt-1 text-sm text-edubot-muted">{fulfillmentTypeLabel(data.delivery.method)}{data.delivery.address ? ` - ${data.delivery.address}` : ''}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-semibold text-edubot-ink">Жалпы сумма</h2>
                                <p className="mt-1 text-lg font-bold text-primary">{formatKgs(data.totals.total)}</p>
                            </div>
                        </section>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                    <a
                        href={whatsappUrl(whatsappText)}
                        target="_blank"
                        rel="noreferrer"
                        className="dashboard-button-primary inline-flex items-center gap-2"
                    >
                        <MessageCircle size={16} /> WhatsApp аркылуу жазуу
                    </a>
                    <Link to="/books" className="dashboard-button-secondary">
                        Китеп тандоону улантуу
                    </Link>
                </div>
            </div>
        </main>
    );
}
