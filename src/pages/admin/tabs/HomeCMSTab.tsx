
import React from "react";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { TextInput, Button } from "../ui/Inputs";
import { api, uploadImage, listAdminBooks } from "../../../lib/api";
import type { HomeCMS, BookRow } from "../types";

function HomeCMSTab() {
    const [data, setData] = React.useState<HomeCMS | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [books, setBooks] = React.useState<BookRow[]>([]);

    async function getCMSHome() {
        const { data } = await api.get('/admin/cms/home');
        return data as HomeCMS;
    }
    async function saveCMSHome(body: HomeCMS) {
        const { data } = await api.put('/admin/cms/home', body);
        return data as HomeCMS;
    }

    React.useEffect(() => {
        (async () => {
            try {
                const [cms, list] = await Promise.all([getCMSHome(), listAdminBooks({ limit: 200 })]);
                setData(cms); setBooks(Array.isArray(list) ? list : list.items);
            } finally { setLoading(false); }
        })();
    }, []);

    const updateField = (patch: Partial<HomeCMS>) => setData(prev => ({ ...(prev || { heroSlides: [], featuredBookIds: [], banners: [] }), ...patch }));

    const addHero = () => updateField({ heroSlides: [...(data?.heroSlides || []), { title: 'New slide', imageUrl: '', subtitle: '', ctaLabel: '', ctaHref: '' }] });
    const removeHero = (idx: number) => updateField({ heroSlides: (data?.heroSlides || []).filter((_, i) => i !== idx) });
    const changeHeroImage = async (idx: number, file?: File | null) => {
        if (!file) return; const { url } = await uploadImage(file);
        const slides = [...(data?.heroSlides || [])];
        slides[idx] = { ...slides[idx], imageUrl: url };
        updateField({ heroSlides: slides });
    };

    const addBanner = async (file?: File | null) => {
        if (!file) return; const { url } = await uploadImage(file);
        updateField({ banners: [...(data?.banners || []), { imageUrl: url }] });
    };
    const removeBanner = (idx: number) => updateField({ banners: (data?.banners || []).filter((_, i) => i !== idx) });

    const toggleFeatured = (bookId: number) => {
        const set = new Set(data?.featuredBookIds || []);
        if (set.has(bookId)) set.delete(bookId); else set.add(bookId);
        updateField({ featuredBookIds: Array.from(set) });
    };

    const save = async () => {
        if (!data) return; setSaving(true);
        try { await saveCMSHome(data); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="text-text-muted">Loading…</div>;
    if (!data) return <div className="text-text-muted">No CMS data.</div>;

    return (
        <div className="grid gap-4">
            <Section title="Hero Slides" actions={<Button onClick={addHero} className="bg-dark text-white">+ Add Slide</Button>}>
                <div className="grid gap-4 md:grid-cols-2">
                    {(data.heroSlides || []).map((s, idx) => (
                        <div key={idx} className="rounded border border-border p-3">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="text-sm font-medium text-dark">Slide {idx + 1}</div>
                                <Button onClick={() => removeHero(idx)} className="border border-border bg-white text-red-600">Delete</Button>
                            </div>
                            <div className="grid gap-3">
                                <Field label="Title"><TextInput value={s.title} onChange={(e) => {
                                    const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], title: e.target.value }; updateField({ heroSlides: slides });
                                }} /></Field>
                                <Field label="Subtitle"><TextInput value={s.subtitle || ''} onChange={(e) => {
                                    const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], subtitle: e.target.value }; updateField({ heroSlides: slides });
                                }} /></Field>
                                <div className="flex items-center gap-3">
                                    <div className="text-sm font-medium text-dark">Image</div>
                                    <input type="file" accept="image/*" onChange={(e) => changeHeroImage(idx, e.target.files?.[0])} />
                                    {s.imageUrl && <img src={s.imageUrl} className="h-14 w-24 rounded object-cover" />}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="CTA Label"><TextInput value={s.ctaLabel || ''} onChange={(e) => { const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], ctaLabel: e.target.value }; updateField({ heroSlides: slides }); }} /></Field>
                                    <Field label="CTA Href"><TextInput value={s.ctaHref || ''} onChange={(e) => { const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], ctaHref: e.target.value }; updateField({ heroSlides: slides }); }} /></Field>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Banners" actions={<label className="cursor-pointer rounded bg-dark px-3 py-2 text-sm font-semibold text-white"><input type="file" accept="image/*" className="hidden" onChange={(e) => addBanner(e.target.files?.[0])} />+ Add Banner</label>}>
                {(data.banners || []).length ? (
                    <ul className="flex flex-wrap gap-3">
                        {data.banners!.map((b, idx) => (
                            <li key={idx} className="relative">
                                <img src={b.imageUrl} className="h-24 w-40 rounded object-cover" />
                                <div className="absolute right-1 top-1">
                                    <Button onClick={() => removeBanner(idx)} className="border border-border bg-white text-red-600">✕</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <div className="text-text-muted">No banners yet.</div>}
            </Section>

            <Section title="Featured Books">
                <div className="grid gap-2 md:grid-cols-2">
                    {books.map(b => (
                        <label key={b.id} className="flex items-center justify-between rounded border border-border p-2 text-sm">
                            <div className="flex items-center gap-3">
                                {b.imageUrl ? <img src={b.imageUrl} className="h-10 w-8 rounded object-cover" /> : <div className="h-10 w-8 rounded bg-neutral/50" />}
                                <div>
                                    <div className="font-medium text-dark">{b.title}</div>
                                    <div className="text-text-muted">{b.authorName || '—'}</div>
                                </div>
                            </div>
                            <input type="checkbox" className="accent-primary" checked={Boolean(data.featuredBookIds?.includes(b.id))} onChange={() => toggleFeatured(b.id)} />
                        </label>
                    ))}
                </div>
            </Section>

            <div className="flex justify-end">
                <Button onClick={save} disabled={saving} className="bg-dark text-white">{saving ? 'Saving…' : 'Save CMS'}</Button>
            </div>
        </div>
    );
}

export default HomeCMSTab;
