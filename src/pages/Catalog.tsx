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
import SEO from "../components/SEO";
import { whatsappUrl } from "../lib/business";
import { trackEvent } from "../lib/analytics";

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
    const [minPrice, setMinPrice] = React.useState<number | "">(parseNumberParam(searchParams.get("minPrice")));
    const [maxPrice, setMaxPrice] = React.useState<number | "">(parseNumberParam(searchParams.get("maxPrice")));
    const [sort, setSort] = React.useState<SortValue>(parseSortParam(searchParams.get("sort")));
    const [page, setPage] = React.useState(parsePageParam(searchParams.get("page")));
    const limit = 12;
    const searchKey = searchParams.toString();

    React.useEffect(() => {
        const params = new URLSearchParams(searchKey);
        setQ(params.get("q") ?? "");
        setCategory(params.get("category") ?? "");
        setAvailability(parseAvailabilityParam(params.get("availability")));
        setLanguage(params.get("language") ?? "");
        setSubject(params.get("subject") ?? "");
        setGradeLevel(params.get("gradeLevel") ?? "");
        setBookType(parseBookTypeParam(params.get("bookType")));
        setMinPrice(parseNumberParam(params.get("minPrice")));
        setMaxPrice(parseNumberParam(params.get("maxPrice")));
        setSort(parseSortParam(params.get("sort")));
        setPage(parsePageParam(params.get("page")));
    }, [searchKey]);

    React.useEffect(() => {
        const next = new URLSearchParams();
        if (q.trim()) next.set("q", q.trim());
        if (category) next.set("category", category);
        if (language) next.set("language", language);
        if (subject) next.set("subject", subject);
        if (gradeLevel) next.set("gradeLevel", gradeLevel);
        if (bookType) next.set("bookType", bookType);
        if (availability) next.set("availability", availability);
        if (minPrice !== "") next.set("minPrice", String(minPrice));
        if (maxPrice !== "") next.set("maxPrice", String(maxPrice));
        if (sort !== "new") next.set("sort", sort);
        if (page > 1) next.set("page", String(page));
        setSearchParams(next, { replace: true });
    }, [q, category, language, subject, gradeLevel, bookType, availability, minPrice, maxPrice, sort, page, setSearchParams]);

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
    const resetPage = () => setPage(1);

    return (
        <section className="bg-white">
            <SEO
                title="Окуу китептери каталогу"
                description="EduBook каталогунда англис тили, программалоо, экзаменге даярдык жана балдар билими боюнча китептерди тил, деңгээл жана баа боюнча тандаңыз."
                path="/catalog"
            />
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
                            onChange={(e) => {
                                resetPage();
                                setQ(e.target.value);
                            }}
                            placeholder="Аталышы же автору боюнча издөө..."
                            className="dashboard-field"
                        />

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Категория</label>
                            <select
                                value={category}
                                onChange={(e) => {
                                    resetPage();
                                    setCategory(e.target.value);
                                }}
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
                                onChange={(e) => {
                                    resetPage();
                                    setAvailability(e.target.value as AvailabilityValue);
                                }}
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
                                onChange={(e) => {
                                    resetPage();
                                    setSubject(e.target.value);
                                }}
                                placeholder="Мисалы: Англис тили, Python, математика"
                                className="dashboard-field"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Тил</label>
                            <select
                                value={language}
                                onChange={(e) => {
                                    resetPage();
                                    setLanguage(e.target.value);
                                }}
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
                                onChange={(e) => {
                                    resetPage();
                                    setGradeLevel(e.target.value);
                                }}
                                placeholder="5-класс, баштапкы деңгээл..."
                                className="dashboard-field"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-semibold text-edubot-ink">Китеп түрү</label>
                            <select
                                value={bookType}
                                onChange={(e) => {
                                    resetPage();
                                    setBookType(e.target.value as BookType | "");
                                }}
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
                                    onChange={(e) => {
                                        resetPage();
                                        setMinPrice(e.target.value === "" ? "" : Number(e.target.value));
                                    }}
                                    placeholder="Мин."
                                    className="dashboard-field"
                                />
                                <input
                                    type="number"
                                    min={0}
                                    value={maxPrice}
                                    onChange={(e) => {
                                        resetPage();
                                        setMaxPrice(e.target.value === "" ? "" : Number(e.target.value));
                                    }}
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
                                setPage(1);
                            }}
                            aria-label="Каталог чыпкаларын тазалоо"
                            className="dashboard-button-secondary w-full"
                        >
                            Чыпкаларды тазалоо
                        </button>
                        <div className="rounded-2xl border border-edubot-orange/20 bg-white p-4">
                            <h3 className="text-sm font-semibold text-edubot-ink">Китеп тандоодо жардам керекпи?</h3>
                            <p className="mt-2 text-xs leading-5 text-edubot-muted">
                                Деңгээлиңизди, максатыңызды жана тилди жазсаңыз, ылайыктуу бөлүмдү сунуштайбыз.
                            </p>
                            <a
                                href={whatsappUrl("Саламатсызбы, каталогдон китеп тандоодо жардам керек.")}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => trackEvent("catalog_filter_whatsapp_click")}
                                className="dashboard-button-primary mt-3 w-full"
                            >
                                WhatsApp аркылуу суроо
                            </a>
                        </div>
                    </aside>

                    <div>
                        <div className="mb-5 grid gap-3 md:grid-cols-4">
                            <QuickFilter label="Англис тили" toBookType="LANGUAGE_LEARNING" setBookType={setBookType} resetPage={resetPage} />
                            <QuickFilter label="Экзамен" toBookType="EXAM_PREP" setBookType={setBookType} resetPage={resetPage} />
                            <QuickFilter label="Программалоо" toBookType="PROGRAMMING" setBookType={setBookType} resetPage={resetPage} />
                            <QuickFilter label="Балдар билими" toBookType="CHILDREN_EDUCATION" setBookType={setBookType} resetPage={resetPage} />
                        </div>
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div className="text-sm text-edubot-muted">
                                {booksQuery.isLoading ? "Китептер жүктөлүүдө..." : `${booksQuery.data?.total ?? 0} китеп табылды`}
                            </div>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    resetPage();
                                    setSort(e.target.value as SortValue);
                                }}
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
                                            setPage(1);
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

function QuickFilter({ label, toBookType, setBookType, resetPage }: { label: string; toBookType: BookType; setBookType: (value: BookType) => void; resetPage: () => void }) {
    return (
        <button
            type="button"
            onClick={() => {
                trackEvent("catalog_quick_filter_click", { bookType: toBookType });
                resetPage();
                setBookType(toBookType);
            }}
            className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt px-4 py-3 text-left text-sm font-semibold text-edubot-ink transition hover:border-edubot-orange hover:text-edubot-orange"
        >
            {label}
        </button>
    );
}

function parseNumberParam(value: string | null): number | "" {
    if (!value) return "";
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : "";
}

function parsePageParam(value: string | null) {
    if (!value) return 1;
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseSortParam(value: string | null): SortValue {
    return value === "price_asc" || value === "price_desc" || value === "new" ? value : "new";
}

function parseAvailabilityParam(value: string | null): AvailabilityValue {
    return value === "available" || value === "low" || value === "out" ? value : "";
}

function parseBookTypeParam(value: string | null): BookType | "" {
    const bookTypes: BookType[] = [
        "TEXTBOOK",
        "WORKBOOK",
        "READING_BOOK",
        "EXAM_PREP",
        "LANGUAGE_LEARNING",
        "PROGRAMMING",
        "AI_DIGITAL_SKILLS",
        "TEACHER_RESOURCE",
        "COURSE_MATERIAL",
        "CHILDREN_EDUCATION",
        "PERSONAL_DEVELOPMENT",
    ];
    return bookTypes.includes(value as BookType) ? value as BookType : "";
}
