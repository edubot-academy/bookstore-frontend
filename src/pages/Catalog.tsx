import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import BookCard from "../components/BookCard";
import EmptyState from "../components/EmptyState";
import { CatalogGridSkeleton } from "../components/Skeleton";
import { listBooks, listCategories } from "../lib/api";
import type { Book, BookType } from "../lib/types";
import { bookTypeLabel } from "../lib/labels";

type SortValue = "new" | "price_asc" | "price_desc";
type AvailabilityValue = "" | "available" | "low" | "out";

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = React.useState(false);
    const [q, setQ] = React.useState(searchParams.get("q") ?? "");
    const [category, setCategory] = React.useState(searchParams.get("category") ?? "");
    const [availability, setAvailability] = React.useState<AvailabilityValue>((searchParams.get("availability") as AvailabilityValue | null) ?? "");
    const [language, setLanguage] = React.useState(searchParams.get("language") ?? "");
    const [subject, setSubject] = React.useState(searchParams.get("subject") ?? "");
    const [gradeLevel, setGradeLevel] = React.useState(searchParams.get("gradeLevel") ?? "");
    const [bookType, setBookType] = React.useState<BookType | "">((searchParams.get("bookType") as BookType | null) ?? "");
    const [minPrice, setMinPrice] = React.useState<number | "">("");
    const [maxPrice, setMaxPrice] = React.useState<number | "">("");
    const [sort, setSort] = React.useState<SortValue>("new");
    const [page, setPage] = React.useState(1);
    const limit = 12;

    React.useEffect(() => {
        const next = new URLSearchParams();
        if (q.trim()) next.set("q", q.trim());
        if (category) next.set("category", category);
        if (language) next.set("language", language);
        if (subject) next.set("subject", subject);
        if (gradeLevel) next.set("gradeLevel", gradeLevel);
        if (bookType) next.set("bookType", bookType);
        if (availability) next.set("availability", availability);
        setSearchParams(next, { replace: true });
    }, [q, category, language, subject, gradeLevel, bookType, availability, setSearchParams]);

    React.useEffect(() => {
        setPage(1);
    }, [q, category, availability, language, subject, gradeLevel, bookType, minPrice, maxPrice, sort]);

    const booksQuery = useQuery({
        queryKey: ["books", { q, category, language, subject, gradeLevel, bookType, minPrice, maxPrice, sort, page, limit }],
        queryFn: () => listBooks({
            q: q.trim() || undefined,
            category: category || undefined,
            language: language || undefined,
            subject: subject || undefined,
            gradeLevel: gradeLevel || undefined,
            bookType: bookType || undefined,
            minPrice: minPrice === "" ? undefined : minPrice,
            maxPrice: maxPrice === "" ? undefined : maxPrice,
            availability: availability || undefined,
            sort,
            page,
            limit,
        }),
    });

    const categoriesQuery = useQuery({
        queryKey: ["categories"],
        queryFn: listCategories,
    });

    const books = booksQuery.data?.items ?? [];

    const totalPages = booksQuery.data?.totalPages ?? 1;
    const activeFilterCount = [q.trim(), category, availability, language, subject, gradeLevel, bookType, minPrice, maxPrice]
        .filter((value) => value !== "").length;

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">EduBook каталогу</p>
                    <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">Окуу китептери</h1>
                    <p className="mt-2 text-sm text-edubot-muted">Китептерди предмет, тил, деңгээл жана окуу максаты боюнча табыңыз.</p>
                </div>

                <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen((value) => !value)}
                        className="inline-flex items-center gap-2 rounded-full border border-edubot-line bg-white px-4 py-2 text-sm font-semibold text-edubot-ink"
                    >
                        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                        {filtersOpen ? "Чыпкаларды жашыруу" : "Чыпкаларды көрсөтүү"}
                        {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
                    </button>
                    <div className="text-sm text-edubot-muted">
                        {booksQuery.isLoading ? "Жүктөлүүдө..." : `${books.length} көрсөтүлдү`}
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-[260px_1fr]">
                    <aside className={`${filtersOpen ? "block" : "hidden"} h-fit space-y-4 rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4 shadow-edubot-soft md:sticky md:top-28 md:block`}>
                        <div>
                            <h2 className="font-semibold text-edubot-ink">Керектүү китепти табыңыз</h2>
                            <p className="mt-1 text-xs text-edubot-muted">Предмет, деңгээл жана тил боюнча чыпкалаңыз.</p>
                        </div>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Аталышы же автору боюнча издөө..."
                            className="dashboard-field"
                        />

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Категория</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="dashboard-select"
                            >
                                <option value="">Бардык категориялар</option>
                                {(categoriesQuery.data ?? []).map((cat) => (
                                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Кампада болушу</label>
                            <select
                                value={availability}
                                onChange={(e) => setAvailability(e.target.value as AvailabilityValue)}
                                className="dashboard-select"
                            >
                                <option value="">Баары</option>
                                <option value="available">Кампада бар</option>
                                <option value="low">Аз калды</option>
                                <option value="out">Кампада жок</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Предмет</label>
                            <input
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Программалоо, англис тили..."
                                className="dashboard-field"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Тил</label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="dashboard-select"
                            >
                                <option value="">Бардык тилдер</option>
                                <option value="Kyrgyz">Кыргызча</option>
                                <option value="Russian">Орусча</option>
                                <option value="English">Англисче</option>
                                <option value="Turkish">Түркчө</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Класс / деңгээл</label>
                            <input
                                value={gradeLevel}
                                onChange={(e) => setGradeLevel(e.target.value)}
                                placeholder="5-класс, баштапкы деңгээл..."
                                className="dashboard-field"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Китеп түрү</label>
                            <select
                                value={bookType}
                                onChange={(e) => setBookType(e.target.value as BookType | "")}
                                className="dashboard-select"
                            >
                                <option value="">Бардык түрлөр</option>
                                {(['TEXTBOOK', 'WORKBOOK', 'EXAM_PREP', 'LANGUAGE_LEARNING', 'PROGRAMMING', 'AI_DIGITAL_SKILLS', 'CHILDREN_EDUCATION', 'TEACHER_RESOURCE'] as BookType[]).map((value) => (
                                    <option key={value} value={value}>{bookTypeLabel(value)}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Баасы</label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="Мин."
                                    className="dashboard-field"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                    placeholder="Макс."
                                    className="dashboard-field"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setQ("");
                                setCategory("");
                                setAvailability("");
                                setLanguage("");
                                setSubject("");
                                setGradeLevel("");
                                setBookType("");
                                setMinPrice("");
                                setMaxPrice("");
                                setSort("new");
                            }}
                            aria-label="Каталог чыпкаларын тазалоо"
                            className="dashboard-button-secondary w-full"
                        >
                            Чыпкаларды тазалоо
                        </button>
                    </aside>

                    <div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-edubot-muted">
                                {booksQuery.isLoading ? "Китептер жүктөлүүдө..." : `${booksQuery.data?.total ?? 0} китеп табылды`}
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as SortValue)}
                                className="dashboard-select max-w-[220px]"
                            >
                                <option value="new">Жаңылары биринчи</option>
                                <option value="price_asc">Баасы арзанынан</option>
                                <option value="price_desc">Баасы кымбатынан</option>
                            </select>
                        </div>

                        {booksQuery.isLoading ? (
                            <CatalogGridSkeleton count={6} />
                        ) : booksQuery.isError ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Китептер жүктөлгөн жок.</div>
                        ) : books.length === 0 ? (
                            <EmptyState
                                title="Бул чыпкалар боюнча китеп табылган жок"
                                description="Чыпканы азайтып же предмет, тил, деңгээл боюнча кеңири издеп көрүңүз."
                                action={(
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setQ("");
                                            setCategory("");
                                            setAvailability("");
                                            setLanguage("");
                                            setSubject("");
                                            setGradeLevel("");
                                            setBookType("");
                                            setMinPrice("");
                                            setMaxPrice("");
                                            setSort("new");
                                        }}
                                        className="dashboard-button-primary"
                                    >
                                        Чыпкаларды тазалоо
                                    </button>
                                )}
                            />
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {books.map((book: Book) => (
                                    <BookCard key={book.id} b={book} />
                                ))}
                            </div>
                        )}

                        <div className="mt-10 flex items-center justify-center gap-3">
                            <button
                                className="grid h-10 w-10 place-items-center rounded-full border border-edubot-line bg-white text-edubot-ink hover:border-edubot-orange hover:text-edubot-orange disabled:opacity-40"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                aria-label="Мурунку бет"
                            >
                                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <div className="rounded-full bg-edubot-surfaceAlt px-3 py-2 text-sm font-medium text-edubot-muted">Бет {page} / {totalPages}</div>
                            <button
                                className="grid h-10 w-10 place-items-center rounded-full border border-edubot-line bg-white text-edubot-ink hover:border-edubot-orange hover:text-edubot-orange disabled:opacity-40"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                aria-label="Кийинки бет"
                            >
                                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
