import { ArrowRight } from "lucide-react";
import article1 from "../../assets/article_1.png";
import article2 from "../../assets/article_2.png";
import article3 from "../../assets/article_3.png";

type Guide = {
    id: number;
    title: string;
    category: string;
    image: string;
    url: string;
    summary: string;
};

const GUIDES: Guide[] = [
    {
        id: 1,
        title: "Англис тили үчүн туура жумушчу китепти кантип тандоо керек",
        category: "Тил үйрөнүү",
        image: article1,
        url: "/catalog?bookType=LANGUAGE_LEARNING",
        summary: "Деңгээлди, көнүгүү форматын жана үйдө окуу тартибин салыштырган ата-энелер үчүн практикалык жолдомо.",
    },
    {
        id: 2,
        title: "Жаңы баштагандар үчүн программалоо китептери",
        category: "Программалоо",
        image: article2,
        url: "/catalog?bookType=PROGRAMMING",
        summary: "HTML, CSS, JavaScript же Python боюнча биринчи окуу китебин алардан мурун эмнеге көңүл буруу керек.",
    },
    {
        id: 3,
        title: "Кайталоого жардам берген экзамен материалдары",
        category: "Экзаменге даярдык",
        image: article3,
        url: "/catalog?bookType=EXAM_PREP",
        summary: "Практикалык суроолор, жооп ачкычтары жана кайталоо планы окуучуга кантип тынч даярданууга жардам берет.",
    },
];

function GuideCard({ guide }: { guide: Guide }) {
    return (
        <a href={guide.url} className="group block rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft transition hover:-translate-y-1 hover:border-edubot-orange/50 hover:shadow-edubot-hover-soft">
            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-edubot-surface">
                <img src={guide.image} alt={guide.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" loading="lazy" />
            </div>
            <div className="mt-4">
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-orange">{guide.category}</div>
                <h3 className="mt-2 text-xl font-semibold leading-snug text-edubot-ink group-hover:text-edubot-orange">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-edubot-muted">{guide.summary}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-edubot-teal">
                    Окшош китептерди көрүү
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
            </div>
        </a>
    );
}

export default function ArticlesSection() {
    return (
        <section className="bg-edubot-surfaceAlt">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="mb-10 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">Окуу жолдомолору</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-edubot-ink md:text-[40px]">
                        Окуучулар жана ата-энелер үчүн китеп тандоо боюнча кеңештер
                    </h2>
                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-edubot-muted">
                        Кийинки макалалар кардарларга жалпы тизмени карап отурбай, пайдалуу окуу материалдарын тандоого жардам берет.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {GUIDES.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                    ))}
                </div>
            </div>
        </section>
    );
}
