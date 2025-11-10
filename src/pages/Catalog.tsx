import * as React from "react";
import BookCard from "../components/BookCard";
import catalog_1 from "../assets/catalog_1.png";
import catalog_2 from "../assets/catalog_2.png";
import catalog_3 from "../assets/catalog_3.png";
import catalog_4 from "../assets/catalog_4.png";
import catalog_5 from "../assets/catalog_5.png";
import catalog_6 from "../assets/catalog_6.png";

/* -------------------------- MOCK DATA -------------------------- */
type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    productType: "Hardcover" | "Paperback" | "Ebook";
    availability: "In stock" | "Out of stock";
    brand: "Penguin" | "HarperCollins" | "OReilly" | "Indie";
    color: "Red" | "Yellow" | "Blue" | "Beige" | "Mixed";
    material: "Paper" | "Premium Paper" | "Digital";
};

const PRODUCT_TYPES = ["Hardcover", "Paperback", "Ebook"] as const;
const BRANDS = ["Penguin", "HarperCollins", "OReilly", "Indie"] as const;
const COLORS = ["Red", "Yellow", "Blue", "Beige", "Mixed"] as const;
const MATERIALS = ["Paper", "Premium Paper", "Digital"] as const;
const AVAIL = ["In stock", "Out of stock"] as const;

const ALL_BOOKS: Book[] = [
    { id: 1, title: "Simple Way Of Piece Life", author: "Armor Ramsey", price: 40, image: catalog_1, productType: "Hardcover", availability: "In stock", brand: "Penguin", color: "Beige", material: "Premium Paper" },
    { id: 2, title: "Great Travel At Desert", author: "Sanchit Howdy", price: 38, image: catalog_2, productType: "Paperback", availability: "In stock", brand: "HarperCollins", color: "Red", material: "Paper" },
    { id: 3, title: "The Lady Beauty Scarlett", author: "Arthur Doyle", price: 45, image: catalog_3, productType: "Hardcover", availability: "Out of stock", brand: "Penguin", color: "Yellow", material: "Premium Paper" },
    { id: 4, title: "Your Simple Book Cover", author: "Ken Adams", price: 42, image: catalog_4, productType: "Ebook", availability: "In stock", brand: "OReilly", color: "Yellow", material: "Digital" },
    { id: 5, title: "The Hypocrite World", author: "Sophia Hill", price: 45, image: catalog_5, productType: "Paperback", availability: "In stock", brand: "Indie", color: "Blue", material: "Paper" },
    { id: 6, title: "The Lady Beauty Scarlett", author: "Arthur Doyle", price: 45, image: catalog_6, productType: "Hardcover", availability: "In stock", brand: "HarperCollins", color: "Mixed", material: "Premium Paper" },

    ...Array.from({ length: 18 }).map((_, i): Book => ({
        id: 100 + i,
        title: `Great Travel At Desert #${i + 1}`,
        author: i % 2 ? "Sanchit Howdy" : "Armor Ramsey",
        price: 35 + (i % 4) * 3,
        image: `src/assets/catalog_${(i + 1) % 6}.png`,
        productType: PRODUCT_TYPES[i % PRODUCT_TYPES.length],
        availability: AVAIL[i % AVAIL.length],
        brand: BRANDS[i % BRANDS.length],
        color: COLORS[i % COLORS.length],
        material: MATERIALS[i % MATERIALS.length],
    })),
];

/* -------------------------- PAGE -------------------------- */
export default function Catalog() {
    // search + sort + page size
    const [q, setQ] = React.useState("");
    const [sort, setSort] = React.useState<"alpha_asc" | "alpha_desc" | "price_asc" | "price_desc">("alpha_asc");
    const [limit, setLimit] = React.useState(12);

    // grid/list + columns (default 3)
    const [view, setView] = React.useState<"grid" | "list">("grid");
    const [gridCols, setGridCols] = React.useState<3 | 4>(3);

    // burger (more) menu
    const [menuOpen, setMenuOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement | null>(null);

    // filters
    const [openFilter, setOpenFilter] = React.useState<string | null>(null); // only one open at a time
    const [minPrice, setMinPrice] = React.useState<number | "">("");
    const [maxPrice, setMaxPrice] = React.useState<number | "">("");
    const [fType, setFType] = React.useState<string[]>([]);
    const [fAvail, setFAvail] = React.useState<string[]>([]);
    const [fBrand, setFBrand] = React.useState<string[]>([]);
    const [fColor, setFColor] = React.useState<string[]>([]);
    const [fMaterial, setFMaterial] = React.useState<string[]>([]);

    const [page, setPage] = React.useState(1);

    // --- NEW: mobile filter drawer state ---
    const [filterOpen, setFilterOpen] = React.useState(false);
    const drawerRef = React.useRef<HTMLDivElement | null>(null);

    // close menus on outside click or ESC
    React.useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
            if (filterOpen && drawerRef.current && !drawerRef.current.contains(e.target as Node)) setFilterOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMenuOpen(false);
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", onDoc);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", onDoc);
            document.removeEventListener("keydown", onEsc);
        };
    }, [filterOpen]);

    // lock body scroll when drawer is open
    React.useEffect(() => {
        if (filterOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = prev; };
        }
    }, [filterOpen]);

    // computed items (filter -> search -> sort)
    const filtered = ALL_BOOKS.filter(b => {
        if (minPrice !== "" && b.price < minPrice) return false;
        if (maxPrice !== "" && b.price > maxPrice) return false;
        if (fType.length && !fType.includes(b.productType)) return false;
        if (fAvail.length && !fAvail.includes(b.availability)) return false;
        if (fBrand.length && !fBrand.includes(b.brand)) return false;
        if (fColor.length && !fColor.includes(b.color)) return false;
        if (fMaterial.length && !fMaterial.includes(b.material)) return false;
        if (q.trim()) {
            const s = q.toLowerCase();
            if (!(`${b.title} ${b.author}`.toLowerCase().includes(s))) return false;
        }
        return true;
    }).sort((a, b) => {
        switch (sort) {
            case "alpha_desc": return b.title.localeCompare(a.title);
            case "price_asc": return a.price - b.price;
            case "price_desc": return b.price - a.price;
            default: return a.title.localeCompare(b.title);
        }
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const pageItems = filtered.slice(start, start + limit);

    React.useEffect(() => { setPage(1); }, [q, sort, limit, minPrice, maxPrice, fType, fAvail, fBrand, fColor, fMaterial]);

    // helpers
    const toggleOnlyOne = (key: string) =>
        setOpenFilter((prev) => (prev === key ? null : key));

    const Check = ({ value, list, setList, label }: { value: string; list: string[]; setList: (v: string[]) => void; label?: string }) => {
        const checked = list.includes(value);
        return (
            <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-text-muted">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setList(checked ? list.filter((x) => x !== value) : [...list, value])}
                    className="accent-primary"
                />
                <span>{label ?? value}</span>
            </label>
        );
    };

    // --- add these helpers inside Catalog() ---
    const hasActiveFilters = Boolean(
        q.trim() ||
        minPrice !== "" ||
        maxPrice !== "" ||
        fType.length > 0 ||
        fAvail.length > 0 ||
        fBrand.length > 0 ||
        fColor.length > 0 ||
        fMaterial.length > 0
    );


    const resetFilters = () => {
        setQ("");
        setMinPrice("");
        setMaxPrice("");
        setFType([]);
        setFAvail([]);
        setFBrand([]);
        setFColor([]);
        setFMaterial([]);
        setOpenFilter(null);
        setPage(1);
    };


    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Top controls */}
                <div className="mb-6 grid items-center gap-4 md:grid-cols-[260px_1fr_auto]">
                    {/* Mobile: Filters button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setFilterOpen(true)}
                            className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-sm font-semibold text-dark"
                            aria-label="Open filters"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                            Filters
                        </button>
                    </div>

                    {/* keep empty for alignment on desktop like before */}
                    <div className="hidden md:block" />

                    <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-4">
                        <div className="text-sm text-text-muted">
                            <span className="font-semibold text-dark">Sort by :</span>{" "}
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value as any)}
                                className="ml-1 rounded border border-border bg-white px-2 py-1 text-sm text-dark"
                            >
                                <option value="alpha_asc">Alphabetically, A - Z</option>
                                <option value="alpha_desc">Alphabetically, Z - A</option>
                                <option value="price_asc">Price, low to high</option>
                                <option value="price_desc">Price, high to low</option>
                            </select>
                        </div>
                        <div className="text-sm text-text-muted">
                            <span className="font-semibold text-dark">Showing</span>{" "}
                            <span className="text-dark">{total ? start + 1 : 0} - {Math.min(start + limit, total)}</span>{" "}
                            of <span className="text-dark">{total}</span> result
                        </div>
                        <div className="text-sm text-text-muted">
                            <span className="font-semibold text-dark">Show :</span>{" "}
                            <select
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                                className="ml-1 rounded border border-border bg-white px-2 py-1 text-sm text-dark"
                            >
                                {[12, 24, 36].map((n) => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        {/* view toggles + burger */}
                        <div className="ml-auto flex items-center gap-2">
                            {/* Grid 3 */}
                            <button
                                onClick={() => { setView("grid"); setGridCols(3); }}
                                className={`grid h-8 w-8 place-items-center rounded border ${view === "grid" && gridCols === 3 ? "border-dark text-dark" : "border-border text-dark/70"}`}
                                title="Grid 3"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="4" width="5" height="6" stroke="currentColor" />
                                    <rect x="9.5" y="4" width="5" height="6" stroke="currentColor" />
                                    <rect x="16" y="4" width="5" height="6" stroke="currentColor" />
                                    <rect x="3" y="14" width="5" height="6" stroke="currentColor" />
                                    <rect x="9.5" y="14" width="5" height="6" stroke="currentColor" />
                                    <rect x="16" y="14" width="5" height="6" stroke="currentColor" />
                                </svg>
                            </button>

                            {/* Grid 4 */}
                            <button
                                onClick={() => { setView("grid"); setGridCols(4); }}
                                className={`grid h-8 w-8 place-items-center rounded border ${view === "grid" && gridCols === 4 ? "border-dark text-dark" : "border-border text-dark/70"}`}
                                title="Grid 4"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    {Array.from({ length: 8 }).map((_, i) => {
                                        const cx = (i % 4) * 5 + 3;
                                        const cy = (i < 4 ? 4 : 14);
                                        return <rect key={i} x={cx} y={cy} width="4" height="6" stroke="currentColor" />;
                                    })}
                                </svg>
                            </button>

                            {/* List */}
                            <button
                                onClick={() => setView("list")}
                                className={`grid h-8 w-8 place-items-center rounded border ${view === "list" ? "border-dark text-dark" : "border-border text-dark/70"}`}
                                title="List"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>

                            {/* Burger menu */}
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className={`grid h-8 w-8 place-items-center rounded border ${menuOpen ? "border-dark text-dark" : "border-border text-dark/80"}`}
                                    aria-haspopup="menu"
                                    aria-expanded={menuOpen}
                                    title="More"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                        <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                    </svg>
                                </button>
                                {menuOpen && (
                                    <div role="menu" className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-border bg-white p-2 shadow-lg">
                                        <div className="px-2 py-1 text-xs uppercase tracking-wider text-text-muted">View</div>
                                        <button className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-neutral/50" onClick={() => { setView("grid"); setGridCols(3); setMenuOpen(false); }}>Grid — 3 cards</button>
                                        <button className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-neutral/50" onClick={() => { setView("grid"); setGridCols(4); setMenuOpen(false); }}>Grid — 4 cards</button>
                                        <button className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-neutral/50" onClick={() => { setView("list"); setMenuOpen(false); }}>List view</button>
                                        <div className="mt-2 border-t border-border" />
                                        <div className="px-2 py-1 text-xs uppercase tracking-wider text-text-muted">Page size</div>
                                        {[12, 24, 36].map(n => (
                                            <button key={n} className="flex w-full items-center justify-between rounded px-2 py-2 text-sm hover:bg-neutral/50"
                                                onClick={() => { setLimit(n); setMenuOpen(false); }}>
                                                Show {n} {limit === n && <span className="text-primary">•</span>}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile filter drawer + overlay */}
                {/* Overlay */}
                {filterOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        onClick={() => setFilterOpen(false)}
                        aria-hidden="true"
                    />
                )}
                {/* Drawer */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] transform bg-white shadow-xl transition-transform duration-300 md:hidden ${filterOpen ? "translate-x-0" : "-translate-x-full"}`}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="mobile-filters-title"
                    ref={drawerRef}
                >
                    <div className="flex items-center justify-between border-b border-border px-4 py-3">
                        <h3 id="mobile-filters-title" className="text-sm font-semibold text-dark">Filters</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={resetFilters}
                                disabled={!hasActiveFilters}
                                className={`rounded px-2 py-1 text-sm font-semibold
        ${hasActiveFilters ? "text-primary hover:bg-neutral/50" : "text-text-muted cursor-not-allowed"}`}
                                aria-disabled={!hasActiveFilters}
                                aria-label="Reset all filters"
                                title="Reset all filters"
                                type="button"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setFilterOpen(false)}
                                className="rounded p-1 text-dark/70 hover:bg-neutral/50"
                                aria-label="Close filters"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="h-[calc(100%-48px)] overflow-y-auto px-4 pb-6 pt-4">
                        <SidebarFilters
                            q={q} setQ={setQ}
                            openFilter={openFilter} toggleOnlyOne={toggleOnlyOne}
                            minPrice={minPrice} setMinPrice={setMinPrice}
                            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                            fType={fType} setFType={setFType}
                            fAvail={fAvail} setFAvail={setFAvail}
                            fBrand={fBrand} setFBrand={setFBrand}
                            fColor={fColor} setFColor={setFColor}
                            fMaterial={fMaterial} setFMaterial={setFMaterial}
                            Check={Check}
                            resetFilters={resetFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-[260px_1fr]">
                    {/* Sidebar (desktop only) */}
                    <aside className="hidden md:block">
                        <SidebarFilters
                            q={q} setQ={setQ}
                            openFilter={openFilter} toggleOnlyOne={toggleOnlyOne}
                            minPrice={minPrice} setMinPrice={setMinPrice}
                            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                            fType={fType} setFType={setFType}
                            fAvail={fAvail} setFAvail={setFAvail}
                            fBrand={fBrand} setFBrand={setFBrand}
                            fColor={fColor} setFColor={setFColor}
                            fMaterial={fMaterial} setFMaterial={setFMaterial}
                            Check={Check}
                            resetFilters={resetFilters}
                            hasActiveFilters={hasActiveFilters}
                        />
                    </aside>

                    {/* Grid/List */}
                    <div>
                        {view === "list" ? (
                            <div className="space-y-4">
                                {pageItems.map((b) => (
                                    <div key={b.id} className="grid grid-cols-[120px_1fr] gap-4 rounded border border-border p-3">
                                        <img src={b.image} alt={b.title} className="aspect-[3/4] w-full rounded object-cover" />
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <div className="text-[15px] font-semibold text-dark">{b.title}</div>
                                                <div className="text-sm text-text-muted">{b.author}</div>
                                            </div>
                                            <div className="text-[15px] font-extrabold text-primary">${b.price.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`grid gap-6 sm:grid-cols-2 ${gridCols === 3 ? "md:grid-cols-3 lg:grid-cols-3" : "md:grid-cols-4 lg:grid-cols-4"}`}>
                                {pageItems.map((b) => (
                                    <BookCard key={b.id} b={b as any} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="mt-10 flex items-center justify-center gap-3">
                            <button
                                className="grid h-9 w-9 place-items-center rounded-full border border-border text-dark disabled:opacity-40"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                aria-label="Previous page"
                            >
                                ←
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-semibold ${page === i + 1 ? "border-primary bg-primary text-white" : "border-border text-dark"}`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="grid h-9 w-9 place-items-center rounded-full border border-border text-dark disabled:opacity-40"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                aria-label="Next page"
                            >
                                →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ----------------------- Filter Group ----------------------- */
function FilterGroup({
    label,
    open,
    onToggle,
    children,
}: {
    label: string;
    open: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="border-b border-border py-4">
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-dark">{label}</h4>
                <button className="text-lg leading-none text-dark/70" onClick={onToggle} aria-label={open ? `Close ${label}` : `Open ${label}`}>
                    {open ? "–" : "+"}
                </button>
            </div>
            {open && <div className="space-y-2 pl-1">{children}</div>}
        </div>
    );
}

/* ----------------------- Sidebar Filters ----------------------- */
function SidebarFilters(props: {
    q: string; setQ: (v: string) => void;
    openFilter: string | null; toggleOnlyOne: (k: string) => void;
    minPrice: number | ""; setMinPrice: (v: number | "") => void;
    maxPrice: number | ""; setMaxPrice: (v: number | "") => void;
    fType: string[]; setFType: (v: string[]) => void;
    fAvail: string[]; setFAvail: (v: string[]) => void;
    fBrand: string[]; setFBrand: (v: string[]) => void;
    fColor: string[]; setFColor: (v: string[]) => void;
    fMaterial: string[]; setFMaterial: (v: string[]) => void;
    Check: React.FC<{ value: string; list: string[]; setList: (v: string[]) => void; label?: string }>;
    resetFilters: () => void;
    hasActiveFilters: boolean;
}) {
    const {
        q, setQ,
        openFilter, toggleOnlyOne,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        fType, setFType,
        fAvail, setFAvail,
        fBrand, setFBrand,
        fColor, setFColor,
        fMaterial, setFMaterial,
        Check,
        resetFilters,
        hasActiveFilters
    } = props;

    return (
        <>
            {/* Search */}
            <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search…"
                className="mb-2 w-full rounded border border-border px-3 py-2 text-sm"
            />
            <div className="mb-5 hidden md:flex items-center justify-between">
                <span className="text-xs text-text-muted">
                    Tip: type title or author
                </span>
                <button
                    onClick={resetFilters}
                    disabled={!hasActiveFilters}
                    className={`rounded px-2 py-1 text-xs font-semibold
      ${hasActiveFilters ? "text-primary hover:bg-neutral/50" : "text-text-muted cursor-not-allowed"}`}
                    aria-disabled={!hasActiveFilters}
                    type="button"
                >
                    Reset
                </button>
            </div>

            {/* Price */}
            <div className="border-b border-border pb-5">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-dark">Price</h4>
                    <button
                        className="text-lg leading-none text-dark/70"
                        onClick={() => toggleOnlyOne("Price")}
                        aria-label={openFilter === "Price" ? "Close price" : "Open price"}
                    >
                        {openFilter === "Price" ? "–" : "+"}
                    </button>
                </div>
                {openFilter === "Price" && (
                    <form
                        onSubmit={(e) => { e.preventDefault(); }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="$"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full rounded border border-border px-3 py-2 text-sm"
                            />
                            <span className="text-text-muted">to</span>
                            <input
                                type="number"
                                placeholder="$"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                className="w-full rounded border border-border px-3 py-2 text-sm"
                            />
                        </div>
                        <button type="submit" className="w-full rounded bg-dark px-3 py-2 text-sm font-semibold text-white">Filter</button>
                    </form>
                )}
            </div>

            {/* Product type */}
            <FilterGroup
                label="Product type"
                open={openFilter === "Product type"}
                onToggle={() => toggleOnlyOne("Product type")}
            >
                {["Hardcover", "Paperback", "Ebook"].map((v) => (
                    <Check key={v} value={v} list={fType} setList={setFType} />
                ))}
            </FilterGroup>

            {/* Availability */}
            <FilterGroup
                label="Availability"
                open={openFilter === "Availability"}
                onToggle={() => toggleOnlyOne("Availability")}
            >
                {["In stock", "Out of stock"].map((v) => (
                    <Check key={v} value={v} list={fAvail} setList={setFAvail} />
                ))}
            </FilterGroup>

            {/* Brand */}
            <FilterGroup
                label="Brand"
                open={openFilter === "Brand"}
                onToggle={() => toggleOnlyOne("Brand")}
            >
                {["Penguin", "HarperCollins", "OReilly", "Indie"].map((v) => (
                    <Check key={v} value={v} list={fBrand} setList={setFBrand} />
                ))}
            </FilterGroup>

            {/* Color */}
            <FilterGroup
                label="Color"
                open={openFilter === "Color"}
                onToggle={() => toggleOnlyOne("Color")}
            >
                <div className="flex flex-wrap gap-2">
                    {["Red", "Yellow", "Blue", "Beige", "Mixed"].map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setFColor(fColor.includes(c) ? fColor.filter(x => x !== c) : [...fColor, c])}
                            className={`h-7 w-7 rounded-full ring-1 ring-border ${fColor.includes(c) ? "outline outline-2 outline-primary" : ""}`}
                            title={c}
                            style={{
                                background:
                                    c === "Red" ? "#ef4444"
                                        : c === "Yellow" ? "#f59e0b"
                                            : c === "Blue" ? "#3b82f6"
                                                : c === "Beige" ? "#e5decf"
                                                    : "linear-gradient(45deg,#ef4444,#f59e0b,#3b82f6)",
                            }}
                        />
                    ))}
                </div>
            </FilterGroup>

            {/* Material */}
            <FilterGroup
                label="Material"
                open={openFilter === "Material"}
                onToggle={() => toggleOnlyOne("Material")}
            >
                {["Paper", "Premium Paper", "Digital"].map((v) => (
                    <Check key={v} value={v} list={fMaterial} setList={setFMaterial} />
                ))}
            </FilterGroup>
        </>
    );
}
