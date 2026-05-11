import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { ARTICLES } from "../data/articles";

export default function ArticlesPage() {
    return (
        <main className="bg-white">
            <SEO
                title="Окуу жолдомолору жана китеп тандоо боюнча макалалар"
                description="EduBook макалалары: англис тили, программалоо, экзаменге даярдык жана окуу борборлору үчүн китеп тандоо боюнча практикалык кеңештер."
                path="/articles"
            />

            <section className="bg-edubot-surfaceAlt">
                <div className="mx-auto max-w-6xl px-4 py-12">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-edubot-orange">
                            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                            EduBook жолдомолору
                        </div>
                        <h1 className="mt-5 text-4xl font-semibold leading-tight text-edubot-ink md:text-5xl">
                            Китеп тандоодо жардам берген пайдалуу макалалар
                        </h1>
                        <p className="mt-4 text-base leading-7 text-edubot-muted">
                            Окуучулар, ата-энелер, мугалимдер жана окуу борборлору үчүн окуу максатына ылайык материал тандоо боюнча практикалык кеңештер.
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 md:grid-cols-2 lg:grid-cols-3">
                    {ARTICLES.map((article) => (
                        <Link
                            key={article.id}
                            to={`/articles/${article.slug}`}
                            className="group flex h-full flex-col rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft transition hover:-translate-y-1 hover:border-edubot-orange/50 hover:shadow-edubot-hover-soft"
                        >
                            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-edubot-surface">
                                <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
                            </div>
                            <div className="flex flex-1 flex-col pt-4">
                                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-orange">{article.category}</div>
                                <h2 className="mt-2 text-xl font-semibold leading-snug text-edubot-ink group-hover:text-edubot-orange">{article.title}</h2>
                                <p className="mt-2 text-sm leading-6 text-edubot-muted">{article.summary}</p>
                                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-edubot-teal">
                                    Макаланы окуу
                                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
