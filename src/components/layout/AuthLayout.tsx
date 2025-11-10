import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Brand / artwork side (hidden on small screens) */}
            <div className="relative hidden lg:block bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-full bg-gray-300" />
                        <span className="text-2xl font-bold tracking-wide">EduBook</span>
                    </Link>
                </div>
            </div>

            {/* Form side */}
            <div className="flex flex-col">
                <header className="flex items-center justify-between px-6 py-4 lg:hidden">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300" />
                        <span className="text-lg font-semibold">EduBook</span>
                    </Link>
                </header>

                <div className="mx-auto w-full max-w-md px-6 py-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
