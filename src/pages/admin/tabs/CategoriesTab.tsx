
import React from "react";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { TextInput, Button } from "../ui/Inputs";
import { createCategory, listAdminCategories, updateCategory, deleteCategory } from "../../../lib/api";
import type { Category } from "../../../lib/types";


function CategoriesTab() {
    const [rows, setRows] = React.useState<Category[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [name, setName] = React.useState('');
    const [slug, setSlug] = React.useState('');

    const load = async () => {
        setLoading(true); setError(null);
        try {
            const data = await listAdminCategories();
            setRows(data);
        }
        catch (e: any) { setError(e?.message || 'Failed to load'); }
        finally { setLoading(false); }
    };
    React.useEffect(() => { load(); }, []);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createCategory({ name: name.trim(), slug: slug.trim() });
        setName(''); setSlug(''); await load();
    };
    const onUpdate = async (row: Category, patch: Partial<Category>) => {
        await updateCategory(row.id, { name: patch.name ?? row.name, slug: patch.slug ?? row.slug });
        await load();
    };
    const onDelete = async (id: number) => {
        if (!confirm('Delete this category?')) return;
        await deleteCategory(id); await load();
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Section title="New Category">
                <form onSubmit={onCreate} className="grid gap-3">
                    <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} required /></Field>
                    <Field label="Slug"><TextInput value={slug} onChange={(e) => setSlug(e.target.value)} required /></Field>
                    <div className="pt-2"><Button type="submit" className="bg-dark text-white">Create</Button></div>
                </form>
            </Section>

            <Section title="All Categories">
                {loading ? (<div className="py-6 text-center text-text-muted">Loading…</div>)
                    : error ? (<div className="py-6 text-center text-red-600">{error}</div>)
                        : rows.length === 0 ? (<div className="py-6 text-center text-text-muted">No categories.</div>)
                            : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-border text-left text-text-muted">
                                            <tr>
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Slug</th>
                                                <th className="px-3 py-2">Created</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((r) => (
                                                <tr key={r.id} className="border-b border-border">
                                                    <td className="px-3 py-2">{r.name}</td>
                                                    <td className="px-3 py-2 text-text-muted">{r.slug}</td>
                                                    {/* <td className="px-3 py-2 text-text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td> */}
                                                    <td className="px-3 py-2">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button onClick={() => onUpdate(r, { name: prompt('New name', r.name) || r.name })} className="border border-border bg-white text-dark">Rename</Button>
                                                            <Button onClick={() => onUpdate(r, { slug: prompt('New slug', r.slug) || r.slug })} className="border border-border bg-white text-dark">Edit Slug</Button>
                                                            <Button onClick={() => onDelete(r.id)} className="border border-border bg-white text-red-600">Delete</Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
            </Section>
        </div>
    );
}

export default CategoriesTab;
