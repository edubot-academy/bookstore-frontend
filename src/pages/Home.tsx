import HeroSection from '../components/UI/HeroSection';
import BookFinderSection from '../components/UI/BookFinderSection';
import CategoriesSection from '../components/UI/CategoriesSection';
import NewReleasesSection from '../components/UI/NewReleasesSection';
import FeaturedBookSection from '../components/UI/FeaturedBookSection';
import PromoBanner from '../components/UI/PromoBanner';
import ArticlesSection from '../components/UI/ArticlesSection';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, PackageCheck, RotateCcw, School } from 'lucide-react';
import type { ReactNode } from 'react';
import SEO from '../components/SEO';
import { BUSINESS, whatsappUrl } from '../lib/business';

// -------------------- Page --------------------
export default function Home() {
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: BUSINESS.name,
        url: BUSINESS.siteUrl,
        telephone: BUSINESS.phoneHref,
        address: {
            "@type": "PostalAddress",
            streetAddress: "Akhunbaev 129B",
            addressLocality: "Bishkek",
            addressCountry: "KG",
        },
        openingHours: "Mo-Su 09:00-20:00",
        description: BUSINESS.description,
    };

    return (
        <div className="flex min-h-screen flex-col">
            <SEO
                title="Бишкекте окуу китептери, англис тили жана экзамен материалдары"
                description="EduBook - Бишкекте окуучулар, ата-энелер жана окуу борборлору үчүн окуу китептери. Англис тили, программалоо, экзаменге даярдык жана балдар билими."
                structuredData={organizationSchema}
            />
            <main className="flex-1">
                <HeroSection />
                <BookFinderSection />
                <CategoriesSection />
                <PromoBanner />
                <NewReleasesSection />
                <FeaturedBookSection />
                <ArticlesSection />
                <HowItWorksSection />
            </main>
        </div>
    );
}

function HowItWorksSection() {
    return (
        <section className="bg-edubot-surfaceAlt">
            <div className="mx-auto max-w-6xl px-4 py-14">
                <div className="mb-8 max-w-2xl">
                    <h2 className="text-3xl font-extrabold text-edubot-dark">Окуу материалдарын жөнөкөй буйрутма берүү</h2>
                    <p className="mt-2 text-sm text-edubot-muted">
                        EduBook азырынча жөнөкөй иштейт: китеп тандаңыз, буйрутма бериңиз, андан кийин командабыз кампа жана алуу жолун тактайт.
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    <Step icon={<School size={22} />} title="Керегиңизге жараша тандаңыз" text="Китептерди предмет, деңгээл, тил жана түрү боюнча табыңыз." />
                    <Step icon={<MapPin size={22} />} title="Akhunbaev 129B дарегинен алып кетүү" text="Китеп даяр болгондо алып кетүү убактысын командабыз менен тактаңыз." />
                    <Step icon={<MessageCircle size={22} />} title="Команда менен ырастоо" text="Буйрутманы телефон же WhatsApp аркылуу тактайбыз." />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <Step icon={<PackageCheck size={22} />} title="Кампада барын текшерүү" text="Заказдан кийин китептин бар-жогу жана актуалдуу баасы ырасталат." />
                    <Step icon={<RotateCcw size={22} />} title="Алмаштыруу шартын тактоо" text="Китеп абалы, басылышы же деңгээли туура келбесе, алдын ала команда менен сүйлөшүңүз." />
                    <Step icon={<MessageCircle size={22} />} title="Тандоодо жардам" text="Деңгээлиңизди жана максатыңызды жазсаңыз, ылайыктуу бөлүмдү сунуштайбыз." />
                </div>
                <div className="mt-8">
                    <Link to="/catalog" className="mr-3 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
                        Каталогду көрүү
                    </Link>
                    <a href={whatsappUrl("Саламатсызбы, китеп тандоодо жардам керек.")} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-edubot-line bg-white px-5 py-3 text-sm font-semibold text-edubot-ink hover:border-edubot-orange hover:text-edubot-orange">
                        WhatsApp аркылуу суроо
                    </a>
                </div>
            </div>
        </section>
    );
}

function Step({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-edubot-line bg-white p-5 shadow-sm">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-edubot-orange/10 text-edubot-orange">{icon}</div>
            <h3 className="mt-4 font-semibold text-edubot-dark">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-edubot-muted">{text}</p>
        </div>
    );
}
