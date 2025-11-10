import { useState, type JSX } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { User as UserIcon, ShoppingBag, Heart, Menu, X, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import bookstore_logo from '../assets/bookstore_logo.svg';

type NavItem = { to: string; label: string; end?: boolean };

const navItems: NavItem[] = [
    { to: '/', label: 'HOME', end: true },
    { to: '/about', label: 'ABOUT US' },
    { to: '/catalog', label: 'BOOKS' },
    { to: '/new', label: 'NEW RELEASE' },
    { to: '/contact', label: 'CONTACT US' },
    { to: '/blog', label: 'BLOG' },
];

export default function Navbar(): JSX.Element {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const linkBase =
        'px-3 text-sm tracking-[0.2em] font-semibold text-black/90 hover:text-black';
    const active = 'text-primary';

    const closeDrawer = () => setOpen(false);

    return (
        <nav className="sticky top-0 z-20 bg-white border-b">
            <div className="mx-auto flex max-w-6xl items-center justify-between py-3 px-4 md:px-0">
                {/* Left: logo + mobile trigger */}
                <div className="flex items-center gap-3">
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Open menu"
                        onClick={() => setOpen(true)}
                    >
                        <Menu size={22} />
                    </button>
                    <Link to="/" className="shrink-0">
                        <img src={bookstore_logo} alt="Bookstore Logo" className="h-16 w-16 rounded-full bg-primary-dark" aria-label="Logo" />
                    </Link>
                </div>

                {/* Center: desktop nav with dividers */}
                <div className="hidden items-center gap-0 md:flex">
                    {navItems.map((item, i) => (
                        <div key={item.to} className="flex items-center">
                            {i !== 0 && <span className="mx-3 h-6 w-px bg-gray-300" />}
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

                {/* Right: account/cart/wishlist */}
                <div className="hidden items-center gap-5 md:flex">
                    {!user ? (
                        <>
                            <NavLink to="/login" className="text-[#37327A] hover:opacity-80" aria-label="Login">
                                <UserIcon size={20} />
                            </NavLink>
                            <span className="h-6 w-px bg-gray-300" />
                            <NavLink to="/cart" className="text-[#37327A] hover:opacity-80" aria-label="Cart">
                                <ShoppingBag size={20} />
                            </NavLink>
                            <span className="h-6 w-px bg-gray-300" />
                            <NavLink to="/wishlist" className="text-[#37327A] hover:opacity-80" aria-label="Wishlist">
                                <Heart size={20} />
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="ml-4 rounded-3xl bg-primary px-4 py-2 text-white text-xs tracking-wide hover:bg-primary-dark"
                            >
                                REGISTER
                            </NavLink>
                        </>
                    ) : (
                        <>
                            {/* Profile menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen((v) => !v)}
                                    className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 hover:bg-gray-50"
                                >
                                    <img
                                        src={user.avatarUrl || 'https://placehold.co/32x32?text=U'}
                                        alt="avatar"
                                        className="h-7 w-7 rounded-full object-cover"
                                    />
                                    <span className="text-sm font-medium">{user.fullName || 'Profile'}</span>
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
                                            <UserIcon size={16} /> Profile
                                        </Link>
                                        <Link
                                            to="/profile/settings"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm"
                                            onClick={() => setProfileOpen(false)}
                                        >
                                            <Settings size={16} /> Settings
                                        </Link>
                                        <button
                                            className="flex w-full items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left text-sm"
                                            onClick={async () => {
                                                await logout();
                                                setProfileOpen(false);
                                                navigate('/');
                                            }}
                                        >
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>

                            <span className="h-6 w-px bg-gray-300" />
                            <NavLink to="/cart" className="text-[#37327A] hover:opacity-80" aria-label="Cart">
                                <ShoppingBag size={20} />
                            </NavLink>
                            <span className="h-6 w-px bg-gray-300" />
                            <NavLink to="/wishlist" className="text-[#37327A] hover:opacity-80" aria-label="Wishlist">
                                <Heart size={20} />
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
                            <div className="h-10 w-10 rounded-full bg-gray-300" />
                            <span className="font-semibold">EduBook</span>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-gray-100" onClick={closeDrawer} aria-label="Close menu">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Account area */}
                    <div className="px-4 py-3 border-b">
                        {!user ? (
                            <div className="flex gap-2">
                                <Link to="/login" onClick={closeDrawer} className="w-1/2 rounded-xl border px-4 py-2 text-center">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={closeDrawer}
                                    className="w-1/2 rounded-xl bg-primary px-4 py-2 text-center text-white"
                                >
                                    Register
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
                                        View profile
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
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            <Link to="/account" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <UserIcon className="inline-block" size={18} />
                            </Link>
                            <Link to="/cart" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <ShoppingBag className="inline-block" size={18} />
                            </Link>
                            <Link to="/wishlist" onClick={closeDrawer} className="rounded-lg border py-2 text-center">
                                <Heart className="inline-block" size={18} />
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
                                Logout
                            </button>
                        )}
                    </nav>
                </aside>
            </div>
        </nav>
    );
}
