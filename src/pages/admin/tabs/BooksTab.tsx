
import React from 'react';
import { BookOpen, Edit3, Plus, Search, Trash2 } from 'lucide-react';
import Section from '../ui/Section';
import { TextInput, Button } from '../ui/Inputs';
import BookFormModal from './BookFormModal';
import { listAdminBooks, deleteBook, listAdminAuthors, listAdminCategories } from '../../../lib/api';
import type { Author, Category } from '../../../lib/types';
import type { BookRow } from '../types';
import { getErrorMessage } from '../../../lib/errors';
import { stockText } from '../../../lib/labels';


function BooksTab() {
    const [q, setQ] = React.useState('');
    const [page, setPage] = React.useState(1);
    const limit = 20;
    const [rows, setRows] = React.useState<BookRow[]>([]);
    const [totalPages, setTotalPages] = React.useState(1);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [authors, setAuthors] = React.useState<Author[]>([]);
    const [categories, setCategories] = React.useState<Category[]>([]);

    const [editing, setEditing] = React.useState<BookRow | null>(null);
    const [showForm, setShowForm] = React.useState(false);

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await listAdminBooks({ page, limit, q: q.trim() || undefined });
            setRows(data.items);
            setTotalPages(data.totalPages || 1);
            const [a, c] = await Promise.all([listAdminAuthors(), listAdminCategories()]);
            setAuthors(Array.isArray(a) ? a : a.items);
            setCategories(c);
        } catch (e: unknown) { setError(getErrorMessage(e, 'Китептер жүктөлгөн жок')); }
        finally { setLoading(false); }
    }, [q, page, limit]);

    React.useEffect(() => { load(); }, [load]);

    const onCreate = () => { setEditing(null); setShowForm(true); };
    const onEdit = (row: BookRow) => { setEditing(row); setShowForm(true); };

    const onDelete = async (id: number) => {
        if (!confirm('Бул китепти өчүрөсүзбү?')) return;
        await deleteBook(id);
        await load();
    };

    return (
        <div className="space-y-4">
            <Section
                title="Китептер"
                actions={(
                    <div className="flex flex-wrap items-center gap-2">
                        <TextInput placeholder="Китептин аталышын издөө..." value={q} onChange={(e) => setQ(e.target.value)} className="min-w-[220px]" />
                        <Button onClick={() => setPage(1)} className="dashboard-button-secondary inline-flex items-center gap-2">
                            <Search className="h-4 w-4" aria-hidden="true" />
                            Издөө
                        </Button>
                        <Button onClick={onCreate} className="dashboard-button-primary inline-flex items-center gap-2">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Китеп кошуу
                        </Button>
                    </div>
                )}
            >
                {loading ? (
                    <BooksSkeleton />
                ) : error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-700">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="rounded-2xl border border-edubot-line bg-white/75 p-10 text-center">
                        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                            <BookOpen className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="font-semibold text-edubot-ink">Китептер табылган жок</div>
                        <p className="mt-1 text-sm text-edubot-muted">Биринчи окуу китебин кошуңуз же издөө шартын өзгөртүңүз.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                                <tr>
                                    <th className="px-4 py-3">Аталышы</th>
                                    <th className="px-4 py-3">Автор</th>
                                    <th className="px-4 py-3">Категория</th>
                                    <th className="px-4 py-3">Багыты</th>
                                    <th className="px-4 py-3">Баасы</th>
                                    <th className="px-4 py-3">Кампада</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3">Кошулган күнү</th>
                                    <th className="px-4 py-3 text-right">Аракеттер</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-edubot-line">
                                {rows.map((r) => (
                                    <tr key={r.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {r.coverUrl ? (
                                                    <img src={r.coverUrl} alt="" className="h-12 w-9 rounded object-cover" />
                                                ) : (
                                                    <div className="grid h-12 w-9 place-items-center rounded bg-edubot-surface text-edubot-orange">
                                                        <BookOpen className="h-5 w-5" aria-hidden="true" />
                                                    </div>
                                                )}
                                                <div className="font-medium text-edubot-ink">{r.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-edubot-muted">{r.authors?.map((a) => a.name).join(', ') || '-'}</td>
                                        <td className="px-4 py-3 text-edubot-muted">{r.category?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-edubot-muted">{[r.subject, r.language, r.gradeLevel].filter(Boolean).join(' / ') || '-'}</td>
                                        <td className="px-4 py-3 font-semibold text-edubot-ink">{r.price != null ? `${Number(r.price).toFixed(2)} KGS` : '-'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${Number(r.stock ?? 0) <= 0 ? 'border-red-200 bg-red-50 text-red-700' : Number(r.stock ?? 0) <= 5 ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                                {stockText(Number(r.stock ?? 0))}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                                Активдүү
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-edubot-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button onClick={() => onEdit(r)} className="dashboard-button-secondary inline-flex items-center gap-2">
                                                    <Edit3 className="h-4 w-4" aria-hidden="true" />
                                                    Түзөтүү
                                                </Button>
                                                <Button onClick={() => onDelete(r.id)} className="border border-red-200 bg-white text-red-600 hover:bg-red-50 inline-flex items-center gap-2">
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

                {/* pagination */}
                <div className="mt-4 flex items-center justify-center gap-2">
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="dashboard-button-secondary">Мурунку</Button>
                    <div className="rounded-full bg-edubot-surfaceAlt px-3 py-2 text-sm font-medium text-edubot-muted">Бет {page} / {totalPages}</div>
                    <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="dashboard-button-secondary">Кийинки</Button>
                </div>
            </Section>

            {showForm && (
                <BookFormModal
                    onClose={() => setShowForm(false)}
                    initial={editing || undefined}
                    authors={authors}
                    categories={categories}
                    onSaved={async () => { setShowForm(false); await load(); }}
                />
            )}
        </div>
    );
}

export default BooksTab;

function BooksSkeleton() {
    return (
        <div className="space-y-3" aria-label="Китептер жүктөлүүдө">
            {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}
