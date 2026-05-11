
import React from "react";
import { ImagePlus, Save, X } from "lucide-react";
import { uploadImage, createBook, updateBook } from "../../../lib/api";
import { Button, TextInput, TextArea } from "../ui/Inputs";
import Field from "../ui/Field";
import type { BookRow, Author, Category } from "../types";
import type { BookType } from "../../../lib/types";
import { getErrorMessage } from "../../../lib/errors";
import { bookTypeLabel } from "../../../lib/labels";

type BookSavePayload = {
    title: string;
    description?: string;
    price?: number;
    coverUrl?: string;
    isbn?: string;
    language?: string;
    publisher?: string;
    gradeLevel?: string;
    subject?: string;
    bookType?: BookType;
    edition?: string;
    targetAudience?: string;
    authorIds: number[];
    categoryId?: number;
    stock?: number;
};




const BookFormModal: React.FC<{
    initial?: BookRow;
    authors: Author[];
    categories: Category[];
    onClose: () => void;
    onSaved: () => void | Promise<void>;
}> = ({ initial, authors, categories, onClose, onSaved }) => {
    const isEdit = Boolean(initial?.id);
    const [title, setTitle] = React.useState(initial?.title || '');
    const [price, setPrice] = React.useState<number | ''>(initial?.price == null ? '' : Number(initial.price));
    const [description, setDescription] = React.useState(initial?.description || '');
    const [authorId, setAuthorId] = React.useState<number | ''>(initial?.authors?.[0]?.id ?? '');
    const [categoryId, setCategoryId] = React.useState<number | ''>(initial?.category?.id ?? '');
    const [coverUrl, setCoverUrl] = React.useState<string | undefined>(initial?.coverUrl ?? undefined);
    const [stock, setStock] = React.useState<number | ''>(initial?.stock ?? '');
    const [isbn, setIsbn] = React.useState(initial?.isbn ?? '');
    const [language, setLanguage] = React.useState(initial?.language ?? '');
    const [publisher, setPublisher] = React.useState(initial?.publisher ?? '');
    const [gradeLevel, setGradeLevel] = React.useState(initial?.gradeLevel ?? '');
    const [subject, setSubject] = React.useState(initial?.subject ?? '');
    const [bookType, setBookType] = React.useState<BookType | ''>(initial?.bookType ?? '');
    const [edition, setEdition] = React.useState(initial?.edition ?? '');
    const [targetAudience, setTargetAudience] = React.useState(initial?.targetAudience ?? '');
    const [submitting, setSubmitting] = React.useState(false);
    const [err, setErr] = React.useState<string | null>(null);

    const onPickImage = async (file?: File | null) => {
        if (!file) return;
        const { url } = await uploadImage(file);
        setCoverUrl(url);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErr(null);
        if (categoryId === '') {
            setErr('Категория милдеттүү.');
            setSubmitting(false);
            return;
        }
        try {
            const payload: BookSavePayload = {
                title: title.trim(),
                description: description.trim(),
                price: price === '' ? undefined : Number(price),
                coverUrl,
                isbn: isbn.trim() || undefined,
                language: language.trim() || undefined,
                publisher: publisher.trim() || undefined,
                gradeLevel: gradeLevel.trim() || undefined,
                subject: subject.trim() || undefined,
                bookType: bookType || undefined,
                edition: edition.trim() || undefined,
                targetAudience: targetAudience.trim() || undefined,
                authorIds: authorId === '' ? [] : [Number(authorId)],
                categoryId: Number(categoryId),
                stock: stock === '' ? undefined : Number(stock),
            };
            if (isEdit && initial?.id) await updateBook(initial.id, payload);
            else await createBook(payload);
            await onSaved();
        } catch (e: unknown) {
            setErr(getErrorMessage(e, 'Сактоо ишке ашкан жок'));
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-edubot-line bg-white shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-edubot-line bg-white/95 px-5 py-4 backdrop-blur">
                    <div>
                        <div className="text-base font-semibold text-edubot-ink">{isEdit ? 'Китепти түзөтүү' : 'Китеп кошуу'}</div>
                        <div className="text-xs text-edubot-muted">Каталогдогу маалыматты жана окуу багыттарын башкарыңыз.</div>
                    </div>
                    <Button onClick={onClose} className="grid h-10 w-10 place-items-center border border-edubot-line bg-white text-edubot-ink hover:border-edubot-orange hover:text-edubot-orange" aria-label="Китеп формасын жабуу">
                        <X className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                <form onSubmit={submit} className="grid gap-5 p-5">
                    <FormSection title="Негизги маалымат" description="Сатуу жана каталог үчүн милдеттүү маалыматтар.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Аталышы"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
                            <Field label="Баасы (KGS)"><TextInput type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required /></Field>
                            <Field label="Автор">
                                <select value={authorId} onChange={(e) => setAuthorId(e.target.value === '' ? '' : Number(e.target.value))} className="dashboard-select">
                                    <option value="">Автор тандаңыз</option>
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Категория">
                                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))} className="dashboard-select" required>
                                    <option value="">Категория тандаңыз</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </Field>
                            <Field label="Кампада"><TextInput type="number" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                        </div>
                    </FormSection>

                    <FormSection title="Окуу маалыматы" description="Окуучуларга, ата-энелерге жана мугалимдерге ылайыктуу китепти табууга жардам берет.">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Предмет"><TextInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Программалоо, англис тили, математика..." /></Field>
                            <Field label="Тили"><TextInput value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Кыргызча, орусча, англисче..." /></Field>
                            <Field label="Класс / деңгээл"><TextInput value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} placeholder="5-класс, баштапкы деңгээл..." /></Field>
                            <Field label="Китеп түрү">
                                <select value={bookType} onChange={(e) => setBookType(e.target.value as BookType | '')} className="dashboard-select">
                                    <option value="">Түрүн тандаңыз</option>
                                    <option value="TEXTBOOK">{bookTypeLabel('TEXTBOOK')}</option>
                                    <option value="WORKBOOK">{bookTypeLabel('WORKBOOK')}</option>
                                    <option value="READING_BOOK">{bookTypeLabel('READING_BOOK')}</option>
                                    <option value="EXAM_PREP">{bookTypeLabel('EXAM_PREP')}</option>
                                    <option value="LANGUAGE_LEARNING">{bookTypeLabel('LANGUAGE_LEARNING')}</option>
                                    <option value="PROGRAMMING">{bookTypeLabel('PROGRAMMING')}</option>
                                    <option value="AI_DIGITAL_SKILLS">{bookTypeLabel('AI_DIGITAL_SKILLS')}</option>
                                    <option value="TEACHER_RESOURCE">{bookTypeLabel('TEACHER_RESOURCE')}</option>
                                    <option value="COURSE_MATERIAL">{bookTypeLabel('COURSE_MATERIAL')}</option>
                                    <option value="CHILDREN_EDUCATION">{bookTypeLabel('CHILDREN_EDUCATION')}</option>
                                    <option value="PERSONAL_DEVELOPMENT">{bookTypeLabel('PERSONAL_DEVELOPMENT')}</option>
                                </select>
                            </Field>
                            <Field label="ISBN"><TextInput value={isbn} onChange={(e) => setIsbn(e.target.value)} /></Field>
                            <Field label="Басмакана"><TextInput value={publisher} onChange={(e) => setPublisher(e.target.value)} /></Field>
                            <Field label="Басылышы"><TextInput value={edition} onChange={(e) => setEdition(e.target.value)} /></Field>
                        </div>
                    </FormSection>

                    <FormSection title="Сүрөттөмө жана аудитория" description="Кардарга тез түшүнүктүү болгон жөнөкөй текст жазыңыз.">
                        <div className="grid gap-4">
                            <Field label="Сүрөттөмө">
                                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </Field>
                            <Field label="Бул китеп кимдер үчүн?">
                                <TextArea value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="Баштапкы деңгээлдеги программалоо окуучулары, 5-класска китеп алган ата-энелер..." />
                            </Field>
                        </div>
                    </FormSection>

                    <FormSection title="Сүрөт" description="Кардар көрө турган мукаба сүрөтүн жүктөңүз же алмаштырыңыз.">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="text-sm font-medium text-edubot-ink">Мукаба сүрөтү</div>
                            <label className="dashboard-button-secondary inline-flex cursor-pointer items-center gap-2">
                                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickImage(e.target.files?.[0])} />
                                Мукаба жүктөө
                            </label>
                            {coverUrl ? (
                                <img src={coverUrl} alt="Мукаба сүрөтүнүн көрүнүшү" className="h-20 w-14 rounded-xl object-cover shadow-edubot-soft" />
                            ) : (
                                <div className="grid h-20 w-14 place-items-center rounded-xl bg-edubot-surface text-edubot-muted">
                                    <ImagePlus className="h-5 w-5" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                    </FormSection>

                    {err && <div className="md:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

                    <div className="sticky bottom-0 -mx-5 -mb-5 flex items-center justify-end gap-2 border-t border-edubot-line bg-white/95 px-5 py-4 backdrop-blur">
                        <Button type="button" onClick={onClose} className="dashboard-button-secondary">Жокко чыгаруу</Button>
                        <Button type="submit" disabled={submitting} className="dashboard-button-primary inline-flex items-center gap-2">
                            <Save className="h-4 w-4" aria-hidden="true" />
                            {submitting ? 'Сакталып жатат...' : 'Сактоо'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;

function FormSection({ title, description, children }: React.PropsWithChildren<{ title: string; description: string }>) {
    return (
        <section className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt/50 p-4">
            <div className="mb-4">
                <h3 className="font-semibold text-edubot-ink">{title}</h3>
                <p className="mt-1 text-xs text-edubot-muted">{description}</p>
            </div>
            {children}
        </section>
    );
}
