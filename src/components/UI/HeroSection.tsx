import { type JSX, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, MapPin, MessageCircle, PackageCheck } from 'lucide-react';
import heroBook from '../../assets/hero-school-supplies-transparent.png';
import { whatsappUrl } from '../../lib/business';
import { trackEvent } from '../../lib/analytics';

export default function HeroSection(): JSX.Element {
    return (
        <section className="bg-edubot-surface">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-[1.05fr_0.95fr] md:py-16">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-edubot-orange/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-edubot-orange">
                        <GraduationCap size={14} /> Бишкектеги окуу китептери
                    </div>
                    <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-edubot-dark md:text-6xl">
                        Окуу китептерин максатка жараша тез тандаңыз.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-edubot-muted md:text-lg">
                        Англис тили, программалоо, балдар билими жана экзаменге даярдык материалдарын деңгээл, тил жана предмет боюнча табыңыз. Кампада барын WhatsApp аркылуу тактап, Akhunbaev 129B дарегинен алып кетсеңиз болот.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link to="/catalog" onClick={() => trackEvent("hero_catalog_click")} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-edubot-soft hover:bg-primary-dark">
                            Китептерди көрүү <ArrowRight size={16} />
                        </Link>
                        <a
                            href={whatsappUrl("Саламатсызбы, китеп тандоодо жардам керек.")}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => trackEvent("hero_whatsapp_click")}
                            className="inline-flex items-center gap-2 rounded-full border border-edubot-line bg-white px-6 py-3 text-sm font-semibold text-edubot-dark hover:border-edubot-orange hover:text-edubot-orange"
                        >
                            <MessageCircle size={16} />
                            Кеңеш алуу
                        </a>
                    </div>
                    <div className="mt-8 grid gap-3 text-sm text-edubot-ink sm:grid-cols-3">
                        <TrustItem icon={<BookOpen size={18} />} label="Максат боюнча тандоо" />
                        <TrustItem icon={<MapPin size={18} />} label="Akhunbaev 129B" />
                        <TrustItem icon={<PackageCheck size={18} />} label="Кампаны тактоо" />
                        <TrustItem icon={<CheckCircle2 size={18} />} label="WhatsApp аркылуу жардам" />
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
