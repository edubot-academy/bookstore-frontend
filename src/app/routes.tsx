// src/App.tsx
import { lazy } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ScrollToTop from '../components/layout/ScrollToTop';
import { useAuth } from '../hooks/useAuth';

const Home = lazy(() => import('../pages/Home'));
const Catalog = lazy(() => import('../pages/Catalog'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Profile = lazy(() => import('../pages/Profile'));
const BookPage = lazy(() => import('../pages/BookPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('../pages/OrderSuccessPage'));
const AdminPage = lazy(() => import('../pages/admin/AdminPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="books" element={<Catalog />} />
                    <Route path="books/:id" element={<BookPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="order-success/:orderNumber" element={<OrderSuccessPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </>
    );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const isAdmin = user?.role?.toLowerCase().includes('admin') ?? false;

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-4 py-10">
                <div className="rounded-2xl border border-edubot-line bg-white p-6 text-sm text-edubot-muted shadow-edubot-card">
                    Башкаруу панели жүктөлүүдө...
                </div>
            </main>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return children;
}
