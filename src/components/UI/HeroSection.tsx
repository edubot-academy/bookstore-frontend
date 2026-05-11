import { type JSX, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, PackageCheck } from 'lucide-react';
import heroBook from '../../assets/hero-book.png';

export default function HeroSection(): JSX.Element {
    return (
        <section className="bg-edubot-surface">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-edubot-orange/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-edubot-orange">
                        <GraduationCap size={14} /> EduBook MVP
                    </div>
                    <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-edubot-dark md:text-6xl">
                        Окуучулар, ата-энелер жана окуу борборлору үчүн китептер.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-edubot-muted md:text-lg">
                        Окуу материалдарын предмет, тил, деңгээл жана курс муктаждыгы боюнча тандаңыз. Онлайн буйрутма берип, алып кетүү же жеткирүүнү командабыз менен тактаңыз.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/catalog" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-edubot-soft hover:bg-primary-dark">
                            Китептерди көрүү <ArrowRight size={16} />
                        </Link>
                        <Link to="/bundles" className="inline-flex items-center gap-2 rounded-full border border-edubot-line bg-white px-6 py-3 text-sm font-semibold text-edubot-dark hover:border-edubot-orange hover:text-edubot-orange">
                            Курс топтомдору
                        </Link>
                    </div>
                    <div className="mt-8 grid gap-3 text-sm text-edubot-ink sm:grid-cols-3">
                        <TrustItem icon={<BookOpen size={18} />} label="Окууга багытталган каталог" />
                        <TrustItem icon={<PackageCheck size={18} />} label="Өзү алып кетүү же жеткирүү" />
                        <TrustItem icon={<CheckCircle2 size={18} />} label="WhatsApp аркылуу ырастоо" />
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-x-8 bottom-3 h-16 rounded-full bg-edubot-orange/20 blur-2xl" />
                    <img src={heroBook} alt="Окуу китептери" className="relative mx-auto max-h-[460px] w-auto object-contain" />
                </div>
            </div>
        </section>
    );
}

function TrustItem({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-edubot-line bg-white/80 px-3 py-2 shadow-sm">
            <span className="text-edubot-green">{icon}</span>
            <span className="font-medium">{label}</span>
        </div>
    );
}
