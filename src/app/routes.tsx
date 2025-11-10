// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import ScrollToTop from '../components/layout/ScrollToTop';

import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';

export default function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="catalog" element={<Catalog />} />
                    <Route path="profile" element={<Profile />} />
                    {/* other site pages under the main chrome */}

                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>
        </>
    );
}
