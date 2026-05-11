import HeroSection from '../components/UI/HeroSection';
import CategoriesSection from '../components/UI/CategoriesSection';
import NewReleasesSection from '../components/UI/NewReleasesSection';
import { Link } from 'react-router-dom';
import { MessageCircle, PackageCheck, School } from 'lucide-react';
import type { ReactNode } from 'react';

// -------------------- Page --------------------
export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <HeroSection />
                <CategoriesSection />
                <NewReleasesSection />
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
                    <Step icon={<PackageCheck size={22} />} title="Өзү алып кетүү же жеткирүү" text="Бишкектен алып кетүүнү же жеткирүүнү тандаңыз." />
                    <Step icon={<MessageCircle size={22} />} title="Команда менен ырастоо" text="Буйрутманы телефон же WhatsApp аркылуу тактайбыз." />
                </div>
                <div className="mt-8">
                    <Link to="/catalog" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
                        Каталогду көрүү
                    </Link>
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
