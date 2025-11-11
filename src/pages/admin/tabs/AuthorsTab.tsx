
import React from "react";
import type { Author } from "../types";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { createAuthor, listAuthors, updateAuthor, deleteAuthor } from "../../../lib/api";
import { TextArea, Button, TextInput } from "../ui/Inputs";

function AuthorsTab() {
    const [rows, setRows] = React.useState<Author[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [name, setName] = React.useState('');
    const [bio, setBio] = React.useState('');

    const load = async () => {
        setLoading(true); setError(null);
        try { setRows(await listAuthors()); } catch (e: any) { setError(e?.message || 'Failed to load'); } finally { setLoading(false); }
    };
    React.useEffect(() => { load(); }, []);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        await createAuthor({ name: name.trim(), bio: bio.trim() || undefined });
        setName(''); setBio(''); await load();
    };
    const onUpdate = async (row: Author, patch: Partial<Author>) => {
        await updateAuthor(row.id, { name: patch.name ?? row.name, bio: patch.bio ?? (row.bio || undefined) });
        await load();
    };
    const onDelete = async (id: number) => {
        if (!confirm('Delete this author?')) return;
        await deleteAuthor(id); await load();
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Section title="New Author">
                <form onSubmit={onCreate} className="grid gap-3">
                    <Field label="Name"><TextInput value={name} onChange={(e) => setName(e.target.value)} required /></Field>
                    <Field label="Bio"><TextArea value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
                    <div className="pt-2"><Button type="submit" className="bg-dark text-white">Create</Button></div>
                </form>
            </Section>

            <Section title="All Authors">
                {loading ? (<div className="py-6 text-center text-text-muted">Loading…</div>)
                    : error ? (<div className="py-6 text-center text-red-600">{error}</div>)
                        : rows.length === 0 ? (<div className="py-6 text-center text-text-muted">No authors.</div>)
                            : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-border text-left text-text-muted">
                                            <tr>
                                                <th className="px-3 py-2">Name</th>
                                                <th className="px-3 py-2">Bio</th>
                                                <th className="px-3 py-2">Created</th>
                                                <th className="px-3 py-2 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((r) => (
                                                <tr key={r.id} className="border-b border-border">
                                                    <td className="px-3 py-2">{r.name}</td>
                                                    <td className="px-3 py-2 text-text-muted truncate max-w-[360px]">{r.bio || '—'}</td>
                                                    <td className="px-3 py-2 text-text-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
                                                    <td className="px-3 py-2">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button onClick={() => onUpdate(r, { name: prompt('New name', r.name) || r.name })} className="border border-border bg-white text-dark">Rename</Button>
                                                            <Button onClick={() => onUpdate(r, { bio: prompt('New bio', r.bio ?? '') ?? r.bio })} className="border border-border bg-white text-dark">Edit Bio</Button>
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

export default AuthorsTab;
