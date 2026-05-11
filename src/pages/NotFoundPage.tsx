import { BookOpen, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4 py-14">
            <section className="w-full rounded-2xl border border-edubot-line bg-white p-8 text-center shadow-edubot-card sm:p-10">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                    <BookOpen className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-edubot-muted">404</p>
                <h1 className="mt-2 text-3xl font-semibold text-edubot-ink">Бет табылган жок</h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-edubot-muted">
                    Бул EduBook бети жок же башка жерге көчүрүлгөн. Каталогду караңыз же башкы бетке кайтыңыз.
                </p>
                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link to="/catalog" className="dashboard-button-primary">
                        <BookOpen className="h-4 w-4" aria-hidden="true" />
                        Китептерди көрүү
                    </Link>
                    <Link to="/" className="dashboard-button-secondary inline-flex items-center justify-center gap-2">
                        <Home className="h-4 w-4" aria-hidden="true" />
                        Башкы бетке кайтуу
                    </Link>
                </div>
            </section>
        </main>
    );
}
