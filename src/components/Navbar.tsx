import { Link, NavLink } from 'react-router-dom';
export default function Navbar() {
    return (
        <nav className="border-b bg-white/70 backdrop-blur sticky top-0 z-10">
            <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
                <Link to="/" className="font-bold text-xl">EduBook</Link>
                <div className="flex gap-4">
                    <NavLink to="/" className="hover:underline">Башкы бет</NavLink>
                    <NavLink to="/catalog" className="hover:underline">Каталог</NavLink>
                    <NavLink to="/admin/books" className="hover:underline">Админ</NavLink>
                </div>
            </div>
        </nav>
    );
}
