
import React from 'react';
import Section from '../ui/Section';
import { TextInput, Button, Chip } from '../ui/Inputs';
import BookFormModal from './BookFormModal';
import { listAdminBooks, updateBook, deleteBook, listAdminAuthors, listAdminCategories } from '../../../lib/api';
import type { Author, Category } from '../../../lib/types';
import type { BookRow } from '../types';


function BooksTab() {
    const [q, setQ] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(20);
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
            const data = await listAdminBooks({ page, limit });
            if (Array.isArray(data.items)) {
                setRows(data.items);
                setTotalPages(data.totalPages || 1);
            } else {
                setRows(data.items);
                // setTotalPages(data.totalPages || 1);
            }
            const [a, c] = await Promise.all([listAdminAuthors(), listAdminCategories()]);
            setAuthors(a.items); setCategories(c);
        } catch (e: any) { setError(e?.message || 'Failed to load books'); }
        finally { setLoading(false); }
    }, [q, page, limit]);

    React.useEffect(() => { load(); }, [load]);

    const onCreate = () => { setEditing(null); setShowForm(true); };
    const onEdit = (row: BookRow) => { setEditing(row); setShowForm(true); };

    const onDelete = async (id: number) => {
        if (!confirm('Delete this book?')) return;
        await deleteBook(id);
        await load();
    };

    const togglePublish = async (row: BookRow) => {
        await updateBook(row.id, { isPublished: !row.isPublished, status: !row.isPublished ? 'published' : 'draft' });
        await load();
    };

    return (
        <div className="space-y-4">
            <Section
                title="Books"
                actions={(
                    <div className="flex flex-wrap items-center gap-2">
                        <TextInput placeholder="Search title…" value={q} onChange={(e) => setQ(e.target.value)} />
                        <Button onClick={() => setPage(1)} className="border border-border bg-white text-dark">Search</Button>
                        <Button onClick={onCreate} className="bg-dark text-white">+ New Book</Button>
                    </div>
                )}
            >
                {loading ? (
                    <div className="py-10 text-center text-text-muted">Loading…</div>
                ) : error ? (
                    <div className="py-10 text-center text-red-600">{error}</div>
                ) : rows.length === 0 ? (
                    <div className="py-10 text-center text-text-muted">No books found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-border text-left text-text-muted">
                                <tr>
                                    <th className="px-3 py-2">Title</th>
                                    <th className="px-3 py-2">Author</th>
                                    <th className="px-3 py-2">Category</th>
                                    <th className="px-3 py-2">Price</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Created</th>
                                    <th className="px-3 py-2 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r) => (
                                    <tr key={r.id} className="border-b border-border">
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-3">
                                                {r.imageUrl ? (
                                                    <img src={r.imageUrl} alt="cover" className="h-10 w-8 rounded object-cover" />
                                                ) : (
                                                    <div className="h-10 w-8 rounded bg-neutral/50" />
                                                )}
                                                <div className="text-dark font-medium">{r.title}</div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-text-muted">{r.authorName ?? '—'}</td>
                                        <td className="px-3 py-2 text-text-muted">{r.categoryName ?? '—'}</td>
                                        <td className="px-3 py-2">{r.price != null ? `$${Number(r.price).toFixed(2)}` : '—'}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <span className={`rounded px-2 py-0.5 text-xs ${r.isPublished ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>{r.isPublished ? 'Published' : (r.status ?? 'draft')}</span>
                                                <Chip onClick={() => togglePublish(r)}>{r.isPublished ? 'Unpublish' : 'Publish'}</Chip>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 text-text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button onClick={() => onEdit(r)} className="border border-border bg-white text-dark">Edit</Button>
                                                <Button onClick={() => onDelete(r.id)} className="border border-border bg-white text-red-600">Delete</Button>
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
                    <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="border border-border bg-white text-dark">←</Button>
                    <div className="text-sm text-text-muted">Page {page} / {totalPages}</div>
                    <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="border border-border bg-white text-dark">→</Button>
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