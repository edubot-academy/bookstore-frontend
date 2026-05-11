
import React from "react";
import { BookOpen, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { TextInput, Button } from "../ui/Inputs";
import { getHomepage, updateHomepage, uploadImage, listAdminBooks } from "../../../lib/api";
import type { HomeCMS, BookRow } from "../types";

function HomeCMSTab() {
    const [data, setData] = React.useState<HomeCMS | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [books, setBooks] = React.useState<BookRow[]>([]);

    async function getCMSHome() {
        const data = await getHomepage('kg') as { sections?: unknown[] };
        const sections = Array.isArray(data.sections) ? data.sections : [];
        const cms = sections.find((section): section is HomeCMS => {
            return typeof section === 'object' && section !== null && 'heroSlides' in section;
        });
        return cms ?? { heroSlides: [], featuredBookIds: [], banners: [] };
    }
    async function saveCMSHome(body: HomeCMS) {
        await updateHomepage({ locale: 'kg', sections: [body], publish: true });
        return body;
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

    const addHero = () => updateField({ heroSlides: [...(data?.heroSlides || []), { title: 'Жаңы слайд', imageUrl: '', subtitle: '', ctaLabel: '', ctaHref: '' }] });
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

    if (loading) return <CmsSkeleton />;
    if (!data) return <div className="rounded-2xl border border-edubot-line bg-white p-8 text-center text-edubot-muted shadow-edubot-soft">Башкы бет контенти жок.</div>;

    return (
        <div className="grid gap-4">
            <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4 text-sm leading-6 text-edubot-muted">
                Башкы бет контенти азыркы MVP үчүн экинчи орунда. Кардар агымы реалдуу каталог маалыматтарын колдонот; муну башкы беттеги жеңил контент үчүн гана колдонуңуз.
            </div>

            <Section title="Башкы слайддар" actions={(
                <Button onClick={addHero} className="dashboard-button-primary inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Слайд кошуу
                </Button>
            )}>
                {(data.heroSlides || []).length === 0 ? (
                    <EmptyCmsState icon={<ImagePlus className="h-6 w-6" aria-hidden="true" />} title="Башкы слайддар жок" description="Башкы бет контенти башкаруу панели аркылуу башкарылганда гана слайд кошуңуз." />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {(data.heroSlides || []).map((s, idx) => (
                            <div key={idx} className="rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div className="text-sm font-semibold text-edubot-ink">Слайд {idx + 1}</div>
                                    <Button onClick={() => removeHero(idx)} className="inline-flex items-center gap-2 border border-red-200 bg-white text-red-600 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        Өчүрүү
                                    </Button>
                                </div>
                                <div className="grid gap-3">
                                    <Field label="Аталышы"><TextInput value={s.title} onChange={(e) => {
                                        const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], title: e.target.value }; updateField({ heroSlides: slides });
                                    }} /></Field>
                                    <Field label="Кошумча текст"><TextInput value={s.subtitle || ''} onChange={(e) => {
                                        const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], subtitle: e.target.value }; updateField({ heroSlides: slides });
                                    }} /></Field>
                                    <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-3">
                                        <div className="mb-2 text-sm font-medium text-edubot-ink">Сүрөт</div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <label className="dashboard-button-secondary cursor-pointer">
                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => changeHeroImage(idx, e.target.files?.[0])} />
                                                Сүрөт жүктөө
                                            </label>
                                            {s.imageUrl ? (
                                                <img src={s.imageUrl} alt="" className="h-16 w-28 rounded-xl object-cover" />
                                            ) : (
                                                <div className="grid h-16 w-28 place-items-center rounded-xl bg-white text-edubot-muted">
                                                    <ImagePlus className="h-6 w-6" aria-hidden="true" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Баскыч тексти"><TextInput value={s.ctaLabel || ''} onChange={(e) => { const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], ctaLabel: e.target.value }; updateField({ heroSlides: slides }); }} /></Field>
                                        <Field label="Баскыч шилтемеси"><TextInput value={s.ctaHref || ''} onChange={(e) => { const slides = [...(data.heroSlides || [])]; slides[idx] = { ...slides[idx], ctaHref: e.target.value }; updateField({ heroSlides: slides }); }} /></Field>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Section>

            <Section title="Баннерлер" actions={(
                <label className="dashboard-button-primary inline-flex cursor-pointer items-center gap-2">
                    <ImagePlus className="h-4 w-4" aria-hidden="true" />
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => addBanner(e.target.files?.[0])} />
                    Баннер кошуу
                </label>
            )}>
                {(data.banners || []).length ? (
                    <ul className="flex flex-wrap gap-3">
                        {data.banners!.map((b, idx) => (
                            <li key={idx} className="relative overflow-hidden rounded-2xl border border-edubot-line bg-white shadow-edubot-soft">
                                <img src={b.imageUrl} alt="" className="h-28 w-44 object-cover" />
                                <div className="absolute right-1 top-1">
                                    <Button onClick={() => removeBanner(idx)} className="grid h-9 w-9 place-items-center border border-red-200 bg-white text-red-600 hover:bg-red-50" aria-label="Баннерди өчүрүү">
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <EmptyCmsState icon={<ImagePlus className="h-6 w-6" aria-hidden="true" />} title="Баннерлер азырынча жок" description="Баннерлер биринчи этаптагы китеп дүкөнү үчүн милдеттүү эмес." />}
            </Section>

            <Section title="Сунушталган китептер">
                {books.length === 0 ? (
                    <EmptyCmsState icon={<BookOpen className="h-6 w-6" aria-hidden="true" />} title="Китептер жок" description="Башкы бетке сунуштоо үчүн адегенде китеп кошуңуз." />
                ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                        {books.map(b => (
                            <label key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-edubot-line bg-white p-3 text-sm shadow-edubot-soft transition hover:border-edubot-orange/50">
                                <div className="flex min-w-0 items-center gap-3">
                                    {b.coverUrl ? <img src={b.coverUrl} alt="" className="h-12 w-9 rounded object-cover" /> : <div className="grid h-12 w-9 place-items-center rounded bg-edubot-surface text-edubot-orange"><BookOpen className="h-5 w-5" aria-hidden="true" /></div>}
                                    <div className="min-w-0">
                                        <div className="truncate font-medium text-edubot-ink">{b.title}</div>
                                        <div className="truncate text-edubot-muted">{b.authors?.map((author) => author.name).join(', ') || '-'}</div>
                                    </div>
                                </div>
                                <input type="checkbox" className="h-5 w-5 accent-primary" checked={Boolean(data.featuredBookIds?.includes(b.id))} onChange={() => toggleFeatured(b.id)} />
                            </label>
                        ))}
                    </div>
                )}
            </Section>

            <div className="sticky bottom-4 z-10 flex justify-end">
                <Button onClick={save} disabled={saving} className="dashboard-button-primary inline-flex items-center gap-2 shadow-edubot-hover-soft">
                    <Save className="h-4 w-4" aria-hidden="true" />
                    {saving ? 'Сакталып жатат...' : 'Контентти сактоо'}
                </Button>
            </div>
        </div>
    );
}

export default HomeCMSTab;

function CmsSkeleton() {
    return (
        <div className="grid gap-4" aria-label="Башкы бет контенти жүктөлүүдө">
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-56 animate-pulse rounded-2xl bg-slate-100" />
        </div>
    );
}

function EmptyCmsState({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
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
