
import React from "react";
import { Edit3, Plus, Trash2, UserRound, X } from "lucide-react";
import type { Author } from "../types";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { createAuthor, listAuthors, updateAuthor, deleteAuthor } from "../../../lib/api";
import { TextArea, Button, TextInput } from "../ui/Inputs";
import { getErrorMessage } from "../../../lib/errors";

function AuthorsTab() {
    const [rows, setRows] = React.useState<Author[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const [name, setName] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [editing, setEditing] = React.useState<Author | null>(null);

    const load = async () => {
        setLoading(true); setError(null);
        try { setRows(await listAuthors()); } catch (e: unknown) { setError(getErrorMessage(e, 'Жүктөө ишке ашкан жок')); } finally { setLoading(false); }
    };
    React.useEffect(() => { load(); }, []);

    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) await updateAuthor(editing.id, { name: name.trim(), bio: bio.trim() || undefined });
        else await createAuthor({ name: name.trim(), bio: bio.trim() || undefined });
        setName(''); setBio(''); setEditing(null); await load();
    };
    const onEdit = (row: Author) => {
        setEditing(row);
        setName(row.name);
        setBio(row.bio || '');
    };
    const onCancelEdit = () => {
        setEditing(null);
        setName('');
        setBio('');
    };
    const onDelete = async (id: number) => {
        if (!confirm('Бул авторду өчүрөсүзбү?')) return;
        await deleteAuthor(id); await load();
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Section title={editing ? 'Авторду түзөтүү' : 'Жаңы автор'} actions={editing ? (
                <Button type="button" onClick={onCancelEdit} className="dashboard-button-secondary inline-flex items-center gap-2">
                    <X className="h-4 w-4" aria-hidden="true" />
                    Жокко чыгаруу
                </Button>
            ) : null}>
                <form onSubmit={onCreate} className="grid gap-3">
                    <Field label="Аты-жөнү"><TextInput value={name} onChange={(e) => setName(e.target.value)} required /></Field>
                    <Field label="Кыска маалымат" hint="Мугалим, басмакана же автор тууралуу кыскача маалымат."><TextArea value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
                    <div className="pt-2">
                        <Button type="submit" className="dashboard-button-primary inline-flex items-center gap-2">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            {editing ? 'Авторду сактоо' : 'Автор кошуу'}
                        </Button>
                    </div>
                </form>
            </Section>

            <Section title="Бардык авторлор">
                {loading ? (<EntitySkeleton />)
                    : error ? (<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">{error}</div>)
                        : rows.length === 0 ? (
                            <div className="rounded-2xl border border-edubot-line bg-white/75 p-8 text-center">
                                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                                    <UserRound className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <div className="font-semibold text-edubot-ink">Авторлор азырынча жок</div>
                                <p className="mt-1 text-sm text-edubot-muted">Китептерди байлоо үчүн автор же басмакана кошуңуз.</p>
                            </div>
                        )
                            : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                                            <tr>
                                                <th className="px-4 py-3">Аты-жөнү</th>
                                                <th className="px-4 py-3">Кыска маалымат</th>
                                                <th className="px-4 py-3">Кошулган күнү</th>
                                                <th className="px-4 py-3 text-right">Аракеттер</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-edubot-line">
                                            {rows.map((r) => (
                                                <tr key={r.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                                    <td className="px-4 py-3 font-medium text-edubot-ink">{r.name}</td>
                                                    <td className="max-w-[360px] truncate px-4 py-3 text-edubot-muted">{r.bio || '-'}</td>
                                                    <td className="px-4 py-3 text-edubot-muted">{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button onClick={() => onEdit(r)} className="dashboard-button-secondary inline-flex items-center gap-2">
                                                                <Edit3 className="h-4 w-4" aria-hidden="true" />
                                                                Түзөтүү
                                                            </Button>
                                                            <Button onClick={() => onDelete(r.id)} className="inline-flex items-center gap-2 border border-red-200 bg-white text-red-600 hover:bg-red-50">
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
        </div>
    );
}

export default AuthorsTab;

function EntitySkeleton() {
    return (
        <div className="space-y-3" aria-label="Авторлор жүктөлүүдө">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 md:grid-cols-3">
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}
