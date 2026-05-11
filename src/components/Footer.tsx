import { Link } from "react-router-dom";
import bookstore_logo from "/bookstore_logo.svg";
import { BUSINESS, whatsappUrl } from "../lib/business";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-primary-dark text-white">
            <DotsDecor />

            <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3">
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <img src={bookstore_logo} alt="EduBook" className="h-14 w-14 shrink-0 rounded-full bg-white p-1 shadow-sm" />
                        <div>
                            <div className="text-xl font-bold">EduBook</div>
                            <div className="text-sm text-white/70">Окуу китептери жана материалдар</div>
                        </div>
                    </div>

                    <p className="max-w-sm text-white/90">
                        Окуучулар, ата-энелер, мугалимдер жана окуу борборлору үчүн китептер. Онлайн буйрутма берип, алып кетүү же жеткирүү шартын командабыз менен тактаңыз.
                    </p>

                    <div className="grid gap-2 text-sm text-white/80">
                        <a href={`tel:${BUSINESS.phoneHref}`} className="text-white hover:text-secondary">{BUSINESS.phoneDisplay}</a>
                        <a href={whatsappUrl("Саламатсызбы, EduBook буйрутмасы боюнча суроом бар.")} className="text-white hover:text-secondary">WhatsApp аркылуу буйрутманы ырастоо</a>
                        <a href={BUSINESS.mapUrl} target="_blank" rel="noreferrer" className="text-white hover:text-secondary">Өзү алып кетүү: {BUSINESS.address}</a>
                        <span>{BUSINESS.workingHours}</span>
                    </div>
                </div>

                <nav aria-label="Дүкөн" className="space-y-6">
                    <h4 className="text-lg font-semibold tracking-wide">ДҮКӨН</h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="hover:underline text-white hover:text-secondary">БАШКЫ БЕТ</Link></li>
                        <li><Link to="/catalog" className="hover:underline text-white hover:text-secondary">КИТЕПТЕР</Link></li>
                        <li><Link to="/bundles" className="hover:underline text-white hover:text-secondary">ТОПТОМДОР</Link></li>
                        <li><Link to="/cart" className="hover:underline text-white hover:text-secondary">СЕБЕТ</Link></li>
                    </ul>
                </nav>

                <nav aria-label="Окуу багыттары" className="space-y-6">
                    <h4 className="text-lg font-semibold tracking-wide">ОКУУ БАГЫТТАРЫ</h4>
                    <ul className="space-y-4 text-white/90">
                        <li><Link to="/catalog?bookType=PROGRAMMING" className="text-white/90 hover:text-secondary">Программалоо жана IT</Link></li>
                        <li><Link to="/catalog?bookType=LANGUAGE_LEARNING" className="text-white/90 hover:text-secondary">Англис тили</Link></li>
                        <li><Link to="/catalog?bookType=CHILDREN_EDUCATION" className="text-white/90 hover:text-secondary">Балдар билими</Link></li>
                        <li><Link to="/catalog?bookType=EXAM_PREP" className="text-white/90 hover:text-secondary">Экзаменге даярдык</Link></li>
                    </ul>
                </nav>
            </div>

            <div className="mx-auto max-w-6xl border-t border-white/20 px-6 py-6 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-white/90">© {year} EduBook. Бардык укуктар корголгон.</div>
                    <div className="text-white/70">Буйрутмалар телефон же WhatsApp аркылуу ырасталат.</div>
                </div>
            </div>
        </footer>
    );
}

/* ------------- background decorative dots ------------- */
function DotsDecor() {
    const Sq = ({ className }: { className: string }) => (
        <span className={`inline-block h-[12px] w-[12px] rounded-[2px] ${className}`} />
    );
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
            {/* top-left cluster */}
            <div className="absolute left-4 top-3 flex flex-col gap-3 opacity-80">
                <Sq className="bg-white/40" />
                <Sq className="bg-white/30" />
                <Sq className="bg-white/40" />
                <Sq className="bg-accent/60" />
            </div>
            {/* left column further down */}
            <div className="absolute left-16 top-8 flex flex-col gap-4 opacity-80">
                <Sq className="bg-white/35" />
                <Sq className="bg-white/35" />
                <Sq className="bg-accent/70" />
            </div>
            {/* right-side scattered */}
            <div className="absolute right-5 top-16 grid grid-cols-3 gap-4 opacity-80">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Sq key={i} className={i % 4 === 0 ? "bg-accent/70" : "bg-white/35"} />
                ))}
            </div>
        </div>
    );
}
