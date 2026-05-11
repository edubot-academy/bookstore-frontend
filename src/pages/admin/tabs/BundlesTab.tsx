import React from 'react';
import { BookOpen, Edit3, Layers, Link2, Plus, Trash2, X } from 'lucide-react';
import {
    createBundle,
    createCourseRecommendation,
    deleteBundle,
    deleteCourseRecommendation,
    listAdminBooks,
    listAdminBundles,
    listAdminCourseRecommendations,
    updateBundle,
    updateCourseRecommendation,
    type BundleDTO,
    type CourseRecommendationDTO,
} from '../../../lib/api';
import type { Book } from '../../../lib/types';
import Section from '../ui/Section';
import Field from '../ui/Field';
import { Button, TextArea, TextInput } from '../ui/Inputs';

type BundleItemForm = { bookId: number | ''; quantity: number };

export default function BundlesTab() {
    const [books, setBooks] = React.useState<Book[]>([]);
    const [bundles, setBundles] = React.useState<BundleDTO[]>([]);
    const [recommendations, setRecommendations] = React.useState<CourseRecommendationDTO[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [editingBundleId, setEditingBundleId] = React.useState<number | null>(null);
    const [editingRecommendationId, setEditingRecommendationId] = React.useState<number | null>(null);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = React.useState('');
    const [price, setPrice] = React.useState<number | ''>('');
    const [discountPrice, setDiscountPrice] = React.useState<number | ''>('');
    const [isActive, setIsActive] = React.useState(true);
    const [items, setItems] = React.useState<BundleItemForm[]>([{ bookId: '', quantity: 1 }]);

    const [externalCourseId, setExternalCourseId] = React.useState('');
    const [courseTitle, setCourseTitle] = React.useState('');
    const [recBookId, setRecBookId] = React.useState<number | ''>('');
    const [recBundleId, setRecBundleId] = React.useState<number | ''>('');
    const [recommendationReason, setRecommendationReason] = React.useState('');
    const [priority, setPriority] = React.useState<number | ''>(0);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [bookData, bundleData, recData] = await Promise.all([
                listAdminBooks({ limit: 300 }),
                listAdminBundles(),
                listAdminCourseRecommendations(),
            ]);
            setBooks(bookData.items);
            setBundles(bundleData);
            setRecommendations(recData);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Топтомдор жүктөлгөн жок');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { load(); }, [load]);

    const resetBundleForm = () => {
        setTitle('');
        setDescription('');
        setImage('');
        setPrice('');
        setDiscountPrice('');
        setIsActive(true);
        setItems([{ bookId: '', quantity: 1 }]);
        setEditingBundleId(null);
    };

    const submitBundle = async (event: React.FormEvent) => {
        event.preventDefault();
        const cleanItems = items.filter((item) => item.bookId !== '').map((item) => ({ bookId: Number(item.bookId), quantity: item.quantity }));
        if (!cleanItems.length || price === '') return;
        const payload = {
            title: title.trim(),
            description: description.trim() || undefined,
            image: image.trim() || undefined,
            price: Number(price),
            discountPrice: discountPrice === '' ? undefined : Number(discountPrice),
            isActive,
            items: cleanItems,
        };
        if (editingBundleId) await updateBundle(editingBundleId, payload);
        else await createBundle(payload);
        resetBundleForm();
        await load();
    };

    const editBundle = (bundle: BundleDTO) => {
        setEditingBundleId(bundle.id);
        setTitle(bundle.title);
        setDescription(bundle.description || '');
        setImage(bundle.image || '');
        setPrice(Number(bundle.price));
        setDiscountPrice(bundle.discountPrice ? Number(bundle.discountPrice) : '');
        setIsActive(bundle.isActive);
        setItems(bundle.items.length ? bundle.items.map((item) => ({ bookId: item.book.id, quantity: item.quantity })) : [{ bookId: '', quantity: 1 }]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetRecommendationForm = () => {
        setExternalCourseId('');
        setCourseTitle('');
        setRecBookId('');
        setRecBundleId('');
        setRecommendationReason('');
        setPriority(0);
        setEditingRecommendationId(null);
    };

    const submitRecommendation = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!recBookId && !recBundleId) return;
        const payload = {
            externalCourseId: externalCourseId.trim(),
            courseTitle: courseTitle.trim() || undefined,
            bookId: recBookId === '' ? null : Number(recBookId),
            bundleId: recBundleId === '' ? null : Number(recBundleId),
            recommendationReason: recommendationReason.trim() || undefined,
            priority: priority === '' ? 0 : Number(priority),
            isActive: true,
        };
        if (editingRecommendationId) await updateCourseRecommendation(editingRecommendationId, payload);
        else await createCourseRecommendation(payload);
        resetRecommendationForm();
        await load();
    };

    const editRecommendation = (rec: CourseRecommendationDTO) => {
        setEditingRecommendationId(rec.id);
        setExternalCourseId(rec.externalCourseId);
        setCourseTitle(rec.courseTitle || '');
        setRecBookId(rec.book?.id ?? '');
        setRecBundleId(rec.bundle?.id ?? '');
        setRecommendationReason(rec.recommendationReason || '');
        setPriority(rec.priority);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateItem = (index: number, patch: Partial<BundleItemForm>) => {
        setItems((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
    };

    const removeBundle = async (id: number) => {
        if (!confirm('Бул топтомду өчүрөсүзбү?')) return;
        await deleteBundle(id);
        await load();
    };

    const removeRecommendation = async (id: number) => {
        if (!confirm('Бул курс сунушун өчүрөсүзбү?')) return;
        await deleteCourseRecommendation(id);
        await load();
    };

    return (
        <div className="grid gap-4">
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4 text-sm leading-6 text-edubot-muted">
                Курс сунуштары азырынча EduBook ичиндеги кол менен киргизилген жазуулар. EduBot/EduPro/CRM интеграциялары кийинкиге калтырылган жана бул башкаруу экранына туташкан эмес.
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Section title={editingBundleId ? 'Курс топтомун түзөтүү' : 'Курс топтомун түзүү'} actions={editingBundleId ? (
                    <Button type="button" onClick={resetBundleForm} className="dashboard-button-secondary inline-flex items-center gap-2">
                        <X className="h-4 w-4" aria-hidden="true" />
                        Түзөтүүнү токтотуу
                    </Button>
                ) : null}>
                    <form onSubmit={submitBundle} className="grid gap-3">
                        <Field label="Аталышы"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Веб иштеп чыгуу баштапкы топтому" /></Field>
                        <Field label="Сүрөттөмө"><TextArea value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
                        <Field label="Сүрөт шилтемеси"><TextInput value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." /></Field>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Баасы"><TextInput type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required /></Field>
                            <Field label="Арзандатылган баа"><TextInput type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                        </div>
                        <label className="flex items-center gap-2 rounded-2xl border border-edubot-line bg-white px-4 py-3 text-sm text-edubot-ink">
                            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-primary" />
                            Коомдук топтом бетинде активдүү
                        </label>
                        <div className="grid gap-2 rounded-2xl border border-edubot-line bg-white/70 p-3">
                            <div className="flex items-center gap-2 text-sm font-semibold text-edubot-ink">
                                <BookOpen className="h-4 w-4 text-edubot-orange" aria-hidden="true" />
                                Топтомдогу китептер
                            </div>
                            {items.map((item, index) => (
                                <div key={index} className="grid gap-2 md:grid-cols-[1fr_120px_auto]">
                                    <select value={item.bookId} onChange={(e) => updateItem(index, { bookId: e.target.value === '' ? '' : Number(e.target.value) })} required className="dashboard-select">
                                        <option value="">Китеп тандаңыз</option>
                                        {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
                                    </select>
                                    <TextInput type="number" min={1} value={item.quantity} onChange={(e) => updateItem(index, { quantity: Number(e.target.value) || 1 })} />
                                    <Button type="button" onClick={() => setItems((current) => current.filter((_, i) => i !== index))} disabled={items.length === 1} className="dashboard-button-secondary">Алып салуу</Button>
                                </div>
                            ))}
                            <Button type="button" onClick={() => setItems((current) => [...current, { bookId: '', quantity: 1 }])} className="dashboard-button-secondary inline-flex items-center justify-center gap-2">
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Китеп кошуу
                            </Button>
                        </div>
                        <Button type="submit" className="dashboard-button-primary inline-flex items-center justify-center gap-2">
                            <Layers className="h-4 w-4" aria-hidden="true" />
                            {editingBundleId ? 'Топтомду жаңыртуу' : 'Топтом түзүү'}
                        </Button>
                    </form>
                </Section>

                <Section title={editingRecommendationId ? 'Курс сунушун түзөтүү' : 'Курс сунушун байлоо'} actions={editingRecommendationId ? (
                    <Button type="button" onClick={resetRecommendationForm} className="dashboard-button-secondary inline-flex items-center gap-2">
                        <X className="h-4 w-4" aria-hidden="true" />
                        Түзөтүүнү токтотуу
                    </Button>
                ) : null}>
                    <form onSubmit={submitRecommendation} className="grid gap-3">
                        <Field label="Тышкы курс ID" hint="Азырынча кол менен шилтеме гана. Интеграциялар кийинкиге калтырылган."><TextInput value={externalCourseId} onChange={(e) => setExternalCourseId(e.target.value)} required placeholder="course-web-101" /></Field>
                        <Field label="Курс аталышы"><TextInput value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Веб иштеп чыгуу баштапкы деңгээл" /></Field>
                        <Field label="Сунушталган китеп">
                            <select value={recBookId} onChange={(e) => setRecBookId(e.target.value === '' ? '' : Number(e.target.value))} className="dashboard-select">
                                <option value="">Жеке китеп жок</option>
                                {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
                            </select>
                        </Field>
                        <Field label="Сунушталган топтом">
                            <select value={recBundleId} onChange={(e) => setRecBundleId(e.target.value === '' ? '' : Number(e.target.value))} className="dashboard-select">
                                <option value="">Топтом жок</option>
                                {bundles.map((bundle) => <option key={bundle.id} value={bundle.id}>{bundle.title}</option>)}
                            </select>
                        </Field>
                        <Field label="Сунуш себеби"><TextArea value={recommendationReason} onChange={(e) => setRecommendationReason(e.target.value)} /></Field>
                        <Field label="Артыкчылык"><TextInput type="number" value={priority} onChange={(e) => setPriority(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                        <Button type="submit" className="dashboard-button-primary inline-flex items-center justify-center gap-2">
                            <Link2 className="h-4 w-4" aria-hidden="true" />
                            {editingRecommendationId ? 'Сунушту жаңыртуу' : 'Сунуш түзүү'}
                        </Button>
                    </form>
                </Section>
            </div>

            <Section title="Топтомдор">
                {loading ? <AdminRowsSkeleton /> : bundles.length === 0 ? (
                    <EmptyAdminState icon={<Layers className="h-6 w-6" aria-hidden="true" />} title="Топтомдор азырынча жок" description="Окуу багыты боюнча китептерди бириктирүү үчүн топтом түзүңүз." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                                <tr><th className="px-4 py-3">Топтом</th><th className="px-4 py-3">Китептер</th><th className="px-4 py-3">Баасы</th><th className="px-4 py-3">Статус</th><th className="px-4 py-3 text-right">Аракеттер</th></tr>
                            </thead>
                            <tbody className="divide-y divide-edubot-line">
                                {bundles.map((bundle) => (
                                    <tr key={bundle.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                        <td className="px-4 py-3"><div className="font-medium text-edubot-ink">{bundle.title}</div><div className="line-clamp-2 text-xs text-edubot-muted">{bundle.description || '-'}</div></td>
                                        <td className="max-w-[360px] truncate px-4 py-3 text-edubot-muted">{bundle.items.map((item) => `${item.book.title} x${item.quantity}`).join(', ') || '-'}</td>
                                        <td className="px-4 py-3 font-semibold text-edubot-ink">{Number(bundle.discountPrice || bundle.price).toFixed(2)} KGS</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${bundle.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                                                {bundle.isActive ? 'Активдүү' : 'Активдүү эмес'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => editBundle(bundle)} className="dashboard-button-secondary inline-flex items-center gap-2">
                                                    <Edit3 className="h-4 w-4" aria-hidden="true" />
                                                    Түзөтүү
                                                </Button>
                                                <Button onClick={() => removeBundle(bundle.id)} className="inline-flex items-center gap-2 border border-red-200 bg-white text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    Өчүрүү
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>

            <Section title="Курс сунуштары">
                {loading ? <AdminRowsSkeleton /> : recommendations.length === 0 ? (
                    <EmptyAdminState icon={<Link2 className="h-6 w-6" aria-hidden="true" />} title="Курс сунуштары азырынча жок" description="Курс контенти даяр болгондо курс-китеп байланыштарын кол менен кошуңуз." />
                ) : <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                            <tr><th className="px-4 py-3">Курс</th><th className="px-4 py-3">Сунуш</th><th className="px-4 py-3">Себеби</th><th className="px-4 py-3">Артыкчылык</th><th className="px-4 py-3 text-right">Аракеттер</th></tr>
                        </thead>
                        <tbody className="divide-y divide-edubot-line">
                            {recommendations.map((rec) => (
                                <tr key={rec.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                    <td className="px-4 py-3"><div className="font-medium text-edubot-ink">{rec.externalCourseId}</div><div className="text-xs text-edubot-muted">{rec.courseTitle || '-'}</div></td>
                                    <td className="px-4 py-3 font-medium text-edubot-ink">{rec.bundle?.title || rec.book?.title || 'Элемент жок'}</td>
                                    <td className="max-w-[360px] truncate px-4 py-3 text-edubot-muted">{rec.recommendationReason || '-'}</td>
                                    <td className="px-4 py-3 text-edubot-muted">{rec.priority}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={() => editRecommendation(rec)} className="dashboard-button-secondary inline-flex items-center gap-2">
                                                <Edit3 className="h-4 w-4" aria-hidden="true" />
                                                Түзөтүү
                                            </Button>
                                            <Button onClick={() => removeRecommendation(rec.id)} className="inline-flex items-center gap-2 border border-red-200 bg-white text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                Өчүрүү
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </Section>
        </div>
    );
}

function AdminRowsSkeleton() {
    return (
        <div className="space-y-3" aria-label="Саптар жүктөлүүдө">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 md:grid-cols-[2fr_1fr_1fr]">
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}

function EmptyAdminState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-edubot-line bg-white/75 p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                {icon}
            </div>
            <div className="font-semibold text-edubot-ink">{title}</div>
            <p className="mt-1 text-sm text-edubot-muted">{description}</p>
        </div>
    );
}
