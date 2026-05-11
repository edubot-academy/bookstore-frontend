import { type JSX } from 'react';
import { BookOpen, Hash, Mail, Phone, UserRound } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Profile(): JSX.Element {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main className="mx-auto max-w-4xl px-4 py-12" aria-label="Профиль жүктөлүүдө">
                <div className="animate-pulse rounded-2xl border border-edubot-line bg-white p-6 shadow-edubot-card">
                    <div className="h-20 w-20 rounded-full bg-slate-100" />
                    <div className="mt-5 h-7 w-56 rounded bg-slate-100" />
                    <div className="mt-3 h-4 w-72 rounded bg-slate-100" />
                    <div className="mt-7 grid gap-4 md:grid-cols-2">
                        <div className="h-24 rounded-2xl bg-slate-100" />
                        <div className="h-24 rounded-2xl bg-slate-100" />
                    </div>
                </div>
            </main>
        );
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <main className="mx-auto max-w-5xl px-4 py-10">
            <section className="overflow-hidden rounded-2xl border border-edubot-line bg-white shadow-edubot-card">
                <div className="bg-edubot-hero p-6 text-white sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">EduBook профили</p>
                    <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center">
                        <img
                            src={user.avatarUrl || 'https://placehold.co/96x96?text=U'}
                            alt=""
                            className="h-24 w-24 rounded-2xl border border-white/20 bg-white/10 object-cover"
                        />
                        <div>
                            <h1 className="text-3xl font-semibold">{user.fullName}</h1>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                                    {user.role === 'admin' ? 'башкаруучу' : 'кардар'}
                                </span>
                                <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/80">
                                    Кардар #{user.id}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <ProfileTile icon={<Mail className="h-5 w-5" aria-hidden="true" />} label="Email" value={user.email || 'Көрсөтүлгөн эмес'} />
                        <ProfileTile icon={<Phone className="h-5 w-5" aria-hidden="true" />} label="Телефон" value={user.phone || 'Көрсөтүлгөн эмес'} />
                        <ProfileTile icon={<Hash className="h-5 w-5" aria-hidden="true" />} label="Кардар ID" value={`#${user.id}`} />
                    </div>

                    <div className="mt-6 rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-edubot-ink">
                                    <UserRound className="h-4 w-4 text-edubot-orange" aria-hidden="true" />
                                    Кардар профили активдүү
                                </div>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-edubot-muted">
                                    Буйрутма тарыхы жана сакталган жеткирүү маалыматы кийинки этапта кошулат. Азырынча аккаунтсуз буйрутма жана телефон аркылуу ырастоо иштейт.
                                </p>
                            </div>
                            <Link to="/catalog" className="dashboard-button-primary shrink-0">
                                <BookOpen className="h-4 w-4" aria-hidden="true" />
                                Китептерди көрүү
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function ProfileTile({ icon, label, value }: { icon: JSX.Element; label: string; value: string }) {
    return (
        <div className="rounded-2xl border border-edubot-line bg-white p-4 shadow-edubot-soft">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-edubot-orange/10 text-edubot-orange">
                {icon}
            </div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-edubot-muted">{label}</div>
            <div className="mt-1 break-words font-semibold text-edubot-ink">{value}</div>
        </div>
    );
}
