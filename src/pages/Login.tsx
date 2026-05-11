import { type JSX, useState, type FormEvent } from 'react';
import { LockKeyhole, Mail, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage } from '../lib/errors';

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await login({ email: email.trim(), password: password.trim() });
            navigate('/');
        } catch (e: unknown) {
            setErr(getErrorMessage(e, 'Кирүү ишке ашкан жок'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="mx-auto grid min-h-[68vh] max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_440px] lg:items-center">
            <section className="rounded-2xl border border-edubot-line bg-edubot-hero p-7 text-white shadow-edubot-card sm:p-9">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">EduBook аккаунту</p>
                <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                    Окуу китептери боюнча буйрутмаларды башкаруу үчүн кириңиз.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/78">
                    Кардарлар аккаунтсуз эле китеп тандап, буйрутма бере алышат. Кирүү профилди сактоо жана башкаруу панели үчүн керек.
                </p>
                <div className="mt-7 grid gap-3 text-sm text-white/82 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                        <ShieldCheck className="mb-3 h-5 w-5 text-edubot-soft" aria-hidden="true" />
                        Коопсуз башкаруу кирүүсү
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                        <Mail className="mb-3 h-5 w-5 text-edubot-soft" aria-hidden="true" />
                        Email аркылуу кирүү
                    </div>
                    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                        <LockKeyhole className="mb-3 h-5 w-5 text-edubot-soft" aria-hidden="true" />
                        Корголгон сессиялар
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card sm:p-7">
                <div className="mb-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-edubot-orange">Кайра келиңиз</p>
                    <h2 className="mt-2 text-2xl font-semibold text-edubot-ink">Кирүү</h2>
                    <p className="mt-2 text-sm text-edubot-muted">Улантуу үчүн EduBook маалыматтарыңызды жазыңыз.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    {err && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-edubot-ink">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-edubot-muted" aria-hidden="true" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="dashboard-field dashboard-field-icon"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-edubot-ink">Сырсөз</label>
                        <div className="relative">
                            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-edubot-muted" aria-hidden="true" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                                className="dashboard-field dashboard-field-icon"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="dashboard-button-primary-lg w-full">
                        {loading ? 'Кирүү жүрүп жатат...' : 'Кирүү'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-edubot-muted">
                    Аккаунтуңуз жокпу?{' '}
                    <Link to="/register" className="font-semibold text-edubot-orange hover:underline">
                        Катталуу
                    </Link>
                </p>
            </section>
        </main>
    );
}
