import article_1 from '../../assets/article_1.png';
import article_2 from '../../assets/article_2.png';
import article_3 from '../../assets/article_3.png';

/* ---- demo data (swap with API) ---- */
type Article = {
    id: number;
    title: string;
    date: string; // "2 Aug, 2021"
    image: string;
    url: string;
};
const ARTICLES: Article[] = [
    {
        id: 1,
        title: 'How to Books Always Makes The Moments Happy',
        date: '1 Sep 2025',
        image: article_1,
        url: '#',
    },
    {
        id: 2,
        title: 'Reading Routines That Really Work',
        date: '1 Sep 2025',
        image: article_2,
        url: '#',
    },
    {
        id: 3,
        title: 'Finding Joy In Small Pages',
        date: '1 Sep 2025',
        image: article_3,
        url: '#',
    },
];


/* ---- tiny social icons ---- */
const Social = () => (
    <div className="flex items-center gap-5 text-dark/70">
        {/* Facebook */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.1l.4-3H14v-1.5a.5.5 0 0 1 .5-.5H15V8z" fill="currentColor" />
        </svg>
        {/* Twitter */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.5 1-1.4-1.5-3.8-1.4-5.1.1-1 1.1-1.2 2.7-.6 4-3.2-.2-6.1-1.7-8-4.1-1 1.8-.5 4.1 1.2 5.3-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.8 3.4 4.2-.6.2-1.2.2-1.9.1.5 1.7 2.1 2.9 3.9 3-1.6 1.2-3.6 1.8-5.6 1.8H2c2 1.2 4.4 1.9 6.9 1.9 8.3 0 12.9-6.9 12.6-12.9.9-.6 1.6-1.3 2.2-2.1z" fill="currentColor" />
        </svg>
        {/* Instagram */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" />
            <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
    </div>
);

function ArticleCard({ a }: { a: Article }) {
    return (
        <a href={a.url} className="block">
            <div className="aspect-[16/10] overflow-hidden bg-neutral/50">
                <img src={a.image} alt={a.title} className="h-full w-full object-cover" loading="lazy" />
            </div>

            <div className="mt-5 space-y-2">
                <div className="text-xs tracking-wide text-text-muted">{a.date}</div>
                <h3 className="text-[22px] font-semibold leading-[1.35] text-dark">{a.title}</h3>
                <div className="mt-6 border-b border-border" />
                <div className="mt-6">
                    <Social />
                </div>
            </div>
        </a>
    );
}

export default function ArticlesSection() {
    return (
        <section className="bg-neutral">
            <div className="mx-auto max-w-6xl px-4 py-16">
                {/* overline + title (center with side rules) */}
                <div className="mb-10 text-center">
                    <div className="relative mx-auto mb-4 flex items-center justify-center gap-6">
                        <span className="hidden h-px w-24 bg-border md:block" />
                        <span className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
                            Read Our Articles
                        </span>
                        <span className="hidden h-px w-24 bg-border md:block" />
                    </div>
                    <h2 className="text-[40px] font-extrabold tracking-tight text-dark">Latest Articles</h2>
                </div>

                {/* 3-up grid */}
                <div className="grid gap-10 md:grid-cols-3">
                    {ARTICLES.map((a) => (
                        <ArticleCard key={a.id} a={a} />
                    ))}
                </div>

                {/* CTA button centered */}
                <div className="mt-14 flex justify-center">
                    <a
                        href="/blog"
                        className="inline-flex items-center gap-2 rounded-md border border-dark px-6 py-3 text-sm font-semibold tracking-[0.12em] text-dark hover:bg-dark/5"
                    >
                        READ ALL ARTICLES
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
