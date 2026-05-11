import { useState, type JSX } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User as UserIcon, ShoppingBag, Menu, X, LogOut, Settings, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import bookstore_logo from '../assets/bookstore_logo.svg';

type NavItem = { to: string; label: string; end?: boolean };

const navItems: NavItem[] = [
    { to: '/', label: 'Башкы бет', end: true },
    { to: '/catalog', label: 'Китептер' },
    { to: '/cart', label: 'Себет' },
];

export default function Navbar(): JSX.Element {
    const { user, logout } = useAuth();
    const { count } = useCart();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const linkBase = 'rounded-full px-4 py-2 text-sm font-semibold text-edubot-ink/80 transition hover:bg-edubot-surfaceAlt hover:text-edubot-dark';
    const active = 'bg-edubot-orange/10 text-edubot-orange';

    const closeDrawer = () => setOpen(false);

    return (
        <nav className="sticky top-0 z-20 border-b border-edubot-line/80 bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* Left: logo + mobile trigger */}
                <div className="flex items-center gap-3">
                    <button
                        className="rounded-lg p-2 hover:bg-edubot-surfaceAlt md:hidden"
                        aria-label="Менюну ачуу"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="flex shrink-0 items-center gap-3">
                        <img src={bookstore_logo} alt="EduBook" className="h-12 w-12 rounded-full bg-edubot-dark" />
                        <div className="hidden leading-tight sm:block">
                            <div className="text-lg font-bold text-edubot-dark">EduBook</div>
                            <div className="text-xs font-medium text-edubot-muted">Окуу китептери дүкөнү</div>
                        </div>
                    </Link>
                </div>

                <div className="hidden items-center gap-1 md:flex">
                    {navItems.map((item) => (
                        <div key={item.to} className="flex items-center">
                            <NavLink
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => `${linkBase} ${isActive ? active : ''}`}
                            >
                                {item.label}
                            </NavLink>
                        </div>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    {!user ? (
                        <>
                            <NavLink to="/login" className="grid h-10 w-10 place-items-center rounded-full border border-edubot-line text-edubot-dark hover:border-edubot-orange hover:text-edubot-orange" aria-label="Кирүү">
                                <UserIcon size={20} />
                            </NavLink>
                            <NavLink to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-edubot-line text-edubot-dark hover:border-edubot-orange hover:text-edubot-orange" aria-label="Себет">
                                <ShoppingBag size={20} />
                                {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-white">{count}</span>}
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="rounded-full bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-white shadow-edubot-soft hover:bg-primary-dark"
                            >
                                Катталуу
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {/* Profile menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-full border border-edubot-line px-2 py-1 hover:bg-edubot-surfaceAlt"
                                >
                                    <img
                                        src={user.avatarUrl || 'https://placehold.co/32x32?text=U'}
                                        alt="Профиль сүрөтү"
                                        className="h-7 w-7 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium">{user.fullName || 'Профиль'}</span>
                                </button>
                                {profileOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg overflow-hidden"
                                        onMouseLeave={() => setProfileOpen(false)}
                                    >
                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <UserIcon size={16} /> Профиль
                                        </Link>
                                        {user?.role === 'admin' && <Link
                                            to="/admin"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Settings size={16} /> Башкаруу
                                        </Link>}
                                        <button
                                            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left text-sm"
                                            onClick={async () => {
                                                await logout();
                                                setProfileOpen(false);
                                                navigate('/');
                                            }}
                                        >
                                            <LogOut size={16} /> Чыгуу
                                        </button>
                                    </div>
                                )}
                            </div>

                            <NavLink to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full border border-edubot-line text-edubot-dark hover:border-edubot-orange hover:text-edubot-orange" aria-label="Себет">
                                <ShoppingBag size={20} />
                                {count > 0 && <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] text-white">{count}</span>}
                            </NavLink>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-30 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
                aria-hidden={!open}
            >
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
                    onClick={closeDrawer}
                />
                {/* Panel */}
                <aside
                    className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="flex items-center justify-between px-4 py-4 border-b">
                        <div className="flex items-center gap-2">
                            <img src={bookstore_logo} alt="EduBook" className="h-10 w-10 rounded-full bg-edubot-dark" />
                            <div>
                                <span className="block font-semibold text-edubot-dark">EduBook</span>
                                <span className="text-xs text-edubot-muted">Окуу үчүн китептер</span>
                            </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100" onClick={closeDrawer} aria-label="Менюну жабуу">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Account area */}
                    <div className="px-4 py-3 border-b">
                        {!user ? (
                            <div className="flex gap-2">
                                <Link to="/login" onClick={closeDrawer} className="w-1/2 rounded-xl border px-4 py-2 text-center">
                                    Кирүү
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeDrawer}
                                    className="w-1/2 rounded-xl bg-primary px-4 py-2 text-center text-white"
                                >
                                    Катталуу
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <img
                                    src={user.avatarUrl || 'https://placehold.co/40x40?text=U'}
                                    className="h-10 w-10 rounded-full object-cover"
                                />
                                <div>
                                    <div className="font-medium">{user.fullName}</div>
                                    <Link to="/profile" onClick={closeDrawer} className="text-sm text-primary">
                                        Профилди көрүү
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Nav links */}
                    <nav className="flex flex-col gap-1 p-3">
                        {navItems.map((n) => (
                            <NavLink
                                key={n.to}
                                to={n.to}
                                end={n.end}
                                onClick={closeDrawer}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}`
                                }
                            >
                                {n.label}
                            </NavLink>
                        ))}
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            <Link to="/profile" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <UserIcon className="inline-block" size={18} />
                            </Link>
                            <Link to="/cart" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <ShoppingBag className="inline-block" size={18} />
                                {count > 0 && <span className="ml-1 text-xs text-primary">{count}</span>}
                            </Link>
                            <Link to="/catalog" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <BookOpen className="inline-block" size={18} />
                            </Link>
                        </div>

                        {user && (
                            <button
                                className="mt-3 rounded-lg border px-3 py-2 text-left text-sm"
                                onClick={async () => {
                                    await logout();
                                    closeDrawer();
                                    location.href = '/';
                                }}
                            >
                                Чыгуу
                            </button>
                        )}
                    </nav>
                </aside>
            </div>
        </nav>
    );
}
