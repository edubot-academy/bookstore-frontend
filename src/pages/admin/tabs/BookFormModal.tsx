
import React from "react";
import { uploadImage, createBook, updateBook } from "../../../lib/api";
import { Button, TextInput, TextArea, Chip } from "../ui/Inputs";
import Field from "../ui/Field";
import type { BookRow, Author, Category } from "../types";





const BookFormModal: React.FC<{
    initial?: BookRow;
    authors: Author[];
    categories: Category[];
    onClose: () => void;
    onSaved: () => void | Promise<void>;
}> = ({ initial, authors, categories, onClose, onSaved }) => {
    const isEdit = Boolean(initial?.id);
    const [title, setTitle] = React.useState(initial?.title || '');
    const [price, setPrice] = React.useState<number | ''>(initial?.price ?? '');
    const [description, setDescription] = React.useState(initial?.description || '');
    const [authorId, setAuthorId] = React.useState<number | ''>(initial?.authorId ?? '');
    const [categoryId, setCategoryId] = React.useState<number | ''>(initial?.categoryId ?? '');
    const [imageUrl, setImageUrl] = React.useState<string | undefined>(initial?.imageUrl);
    const [images, setImages] = React.useState<string[]>(initial?.images ?? []);
    const [isPublished, setIsPublished] = React.useState<boolean>(Boolean(initial?.isPublished));
    const [sku, setSku] = React.useState<string>(initial?.sku ?? '');
    const [stock, setStock] = React.useState<number | ''>(initial?.stock ?? '');
    const [submitting, setSubmitting] = React.useState(false);
    const [err, setErr] = React.useState<string | null>(null);

    const onPickImage = async (file?: File | null) => {
        if (!file) return;
        const { url } = await uploadImage(file);
        setImageUrl(url);
    };
    const onPickGallery = async (files?: FileList | null) => {
        if (!files || files.length === 0) return;
        const uploaded: string[] = [];
        for (const f of Array.from(files)) {
            const { url } = await uploadImage(f);
            uploaded.push(url);
        }
        setImages(prev => [...prev, ...uploaded]);
    };
    const removeGalleryImage = (url: string) => setImages(prev => prev.filter(u => u !== url));
    const moveImage = (from: number, to: number) => setImages(prev => {
        const arr = [...prev];
        const [sp] = arr.splice(from, 1);
        arr.splice(to, 0, sp);
        return arr;
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErr(null);
        try {
            const payload: any = {
                title: title.trim(),
                description: description.trim(),
                price: price === '' ? undefined : Number(price),
                imageUrl,
                images,
                authorId: authorId === '' ? undefined : Number(authorId),
                categoryId: categoryId === '' ? undefined : Number(categoryId),
                isPublished,
                sku: sku.trim() || undefined,
                stock: stock === '' ? undefined : Number(stock),
            };
            if (isEdit && initial?.id) await updateBook(initial.id, payload);
            else await createBook(payload);
            await onSaved();
        } catch (e: any) {
            setErr(e?.message || 'Failed to save');
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-xl border border-border bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div className="text-dark text-base font-semibold">{isEdit ? 'Edit Book' : 'New Book'}</div>
                    <Button onClick={onClose} className="text-dark/70 hover:bg-neutral/50">✕</Button>
                </div>
                <form onSubmit={submit} className="grid gap-4 p-4 md:grid-cols-2">
                    <Field label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} required /></Field>
                    <Field label="Price ($)"><TextInput type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                    <Field label="Author">
                        <select value={authorId as any} onChange={(e) => setAuthorId(e.target.value === '' ? '' : Number(e.target.value))} className="rounded border border-border px-3 py-2 text-sm">
                            <option value="">— Select author —</option>
                            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Category">
                        <select value={categoryId as any} onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))} className="rounded border border-border px-3 py-2 text-sm">
                            <option value="">— Select category —</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </Field>
                    <Field label="SKU"><TextInput value={sku} onChange={(e) => setSku(e.target.value)} /></Field>
                    <Field label="Stock"><TextInput type="number" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                    <Field label="Description" >
                        <TextArea value={description} onChange={(e) => setDescription(e.target.value)} className="md:col-span-2" />
                    </Field>

                    {/* Cover */}
                    <div className="md:col-span-2 grid gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="text-sm font-medium text-dark">Cover image</div>
                            <input type="file" accept="image/*" onChange={(e) => onPickImage(e.target.files?.[0])} />
                            {imageUrl && <img src={imageUrl} alt="cover" className="h-14 w-10 rounded object-cover" />}
                        </div>

                        {/* Gallery */}
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-dark">Gallery</div>
                                <input type="file" multiple accept="image/*" onChange={(e) => onPickGallery(e.target.files)} />
                            </div>
                            {images.length ? (
                                <ul className="flex flex-wrap gap-2">
                                    {images.map((url, idx) => (
                                        <li key={url} className="relative">
                                            <img src={url} alt="gallery" className="h-16 w-16 rounded object-cover" />
                                            <div className="absolute right-0 top-0 flex gap-1 p-1">
                                                <Button type="button" onClick={() => removeGalleryImage(url)} className="border border-border bg-white text-red-600">✕</Button>
                                            </div>
                                            <div className="mt-1 flex justify-center gap-1 text-xs">
                                                <Chip onClick={() => moveImage(idx, Math.max(0, idx - 1))}>←</Chip>
                                                <Chip onClick={() => moveImage(idx, Math.min(images.length - 1, idx + 1))}>→</Chip>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : <div className="text-xs text-text-muted">No gallery images yet.</div>}
                        </div>

                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="accent-primary" /> Published</label>
                    </div>

                    {err && <div className="md:col-span-2 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">{err}</div>}

                    <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                        <Button type="button" onClick={onClose} className="border border-border bg-white text-dark">Cancel</Button>
                        <Button type="submit" disabled={submitting} className="bg-dark text-white">{submitting ? 'Saving…' : 'Save'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;
