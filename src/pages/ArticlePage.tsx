import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Users } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ARTICLES, getArticleBySlug, type Article } from "../data/articles";
import SEO from "../components/SEO";
import { whatsappUrl } from "../lib/business";
import { trackEvent } from "../lib/analytics";

export default function ArticlePage() {
    const { slug } = useParams();
    const article = getArticleBySlug(slug);

    if (!article) return <Navigate to="/404" replace />;

    const relatedArticles = article.relatedSlugs
        .map((relatedSlug) => getArticleBySlug(relatedSlug))
        .filter((related): related is Article => Boolean(related));
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.summary,
        image: article.image,
        author: {
            "@type": "Organization",
            name: "EduBook",
        },
        mainEntityOfPage: `/articles/${article.slug}`,
    };

    return (
        <main className="bg-white">
            <SEO
                title={article.title}
                description={article.summary}
                path={`/articles/${article.slug}`}
                image={article.image}
                type="article"
                structuredData={articleSchema}
            />
            <article>
                <header className="bg-edubot-surfaceAlt">
                    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_420px] lg:items-center lg:py-14">
                        <div>
                            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-edubot-teal hover:text-edubot-orange">
                                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                                Башкы бетке кайтуу
                            </Link>
                            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">{article.category}</p>
                            <h1 className="mt-3 text-4xl font-semibold leading-tight text-edubot-ink md:text-5xl">{article.title}</h1>
                            <p className="mt-5 max-w-3xl text-base leading-7 text-edubot-muted">{article.intro}</p>

                            <div className="mt-6 flex flex-wrap gap-3 text-sm text-edubot-muted">
                                <span className="inline-flex items-center gap-2 rounded-full border border-edubot-line bg-white px-3 py-1.5">
                                    <Clock className="h-4 w-4 text-edubot-orange" aria-hidden="true" />
                                    {article.readTime}
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-edubot-line bg-white px-3 py-1.5">
                                    <Users className="h-4 w-4 text-edubot-teal" aria-hidden="true" />
                                    {article.audience}
                                </span>
                            </div>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <Link to={article.catalogUrl} className="dashboard-button-primary">
                                    {article.catalogCta}
                                </Link>
                                <a
                                    href={whatsappUrl(`Саламатсызбы, "${article.title}" темасы боюнча китеп тандоодо жардам керек.`)}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => trackEvent("article_whatsapp_click", { slug: article.slug })}
                                    className="dashboard-button-secondary inline-flex items-center justify-center"
                                >
                                    WhatsApp аркылуу кеңеш алуу
                                </a>
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-edubot-line bg-white p-3 shadow-edubot-card">
                            <img src={article.image} alt={article.title} className="aspect-[4/3] w-full rounded-xl object-cover" />
                        </div>
                    </div>
                </header>

                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_320px]">
                    <div className="space-y-10">
                        {article.sections.map((section) => (
                            <section key={section.heading}>
                                <h2 className="text-2xl font-semibold text-edubot-ink">{section.heading}</h2>
                                <p className="mt-3 text-[15px] leading-8 text-edubot-muted">{section.body}</p>
                                {section.bullets?.length ? (
                                    <ul className="mt-4 space-y-3">
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet} className="flex gap-3 text-[15px] leading-7 text-edubot-muted">
                                                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-edubot-teal" aria-hidden="true" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </section>
                        ))}

                        <section className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-6">
                            <h2 className="text-2xl font-semibold text-edubot-ink">Кыскача колдоо</h2>
                            <p className="mt-3 text-[15px] leading-8 text-edubot-muted">{article.encouragement}</p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <Link to={article.catalogUrl} className="dashboard-button-primary">
                                    {article.catalogCta}
                                </Link>
                                <a href={whatsappUrl(`Саламатсызбы, ${article.category} боюнча китеп сунуштап бересизби?`)} target="_blank" rel="noreferrer" className="dashboard-button-secondary inline-flex items-center justify-center">
                                    Кеңеш сурайм
                                </a>
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
                        <section className="rounded-2xl border border-edubot-line bg-white p-5 shadow-edubot-soft">
                            <h2 className="text-lg font-semibold text-edubot-ink">Тандоодон мурун текшериңиз</h2>
                            <ul className="mt-4 space-y-3">
                                {article.checklist.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm leading-6 text-edubot-muted">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-edubot-orange" aria-hidden="true" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to={article.catalogUrl} className="dashboard-button-primary mt-5 w-full">
                                <BookOpen className="h-4 w-4" aria-hidden="true" />
                                {article.catalogCta}
                            </Link>
                        </section>

                        {relatedArticles.length ? (
                            <section className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-5">
                                <h2 className="text-lg font-semibold text-edubot-ink">Окшош темалар</h2>
                                <div className="mt-4 space-y-3">
                                    {relatedArticles.map((related) => (
                                        <Link
                                            key={related.id}
                                            to={`/articles/${related.slug}`}
                                            className="group block rounded-xl bg-white p-4 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-edubot-soft"
                                        >
                                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-edubot-orange">{related.category}</span>
                                            <span className="mt-1 block font-semibold leading-6 text-edubot-ink group-hover:text-edubot-orange">{related.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        ) : null}
                    </aside>
                </div>
            </article>

            {ARTICLES.length > 1 ? (
                <section className="bg-edubot-surfaceAlt">
                    <div className="mx-auto max-w-6xl px-4 py-12">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">Окуу жолдомолору</p>
                                <h2 className="mt-2 text-2xl font-semibold text-edubot-ink">Башка пайдалуу макалалар</h2>
                            </div>
                            <Link to="/" className="dashboard-button-secondary inline-flex items-center gap-2">
                                Башкы бет
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </section>
            ) : null}
        </main>
    );
}
