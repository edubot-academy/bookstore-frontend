import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import TopBar from '../../components/UI/TopBar';

type MainLayoutProps = {
    /** Hide the top blue strip if needed (default true) */
    withTopBar?: boolean;
    /** Optional custom class on the <main> tag */
    mainClassName?: string;
};

const MainLayout: React.FC<React.PropsWithChildren<MainLayoutProps>> = ({
    withTopBar = true,
    mainClassName,
}) => {
    return (
        <div className="min-h-screen bg-white text-black">
            {withTopBar && <TopBar phone='+996 700 123 456' />}
            <Navbar />

            {/* Page content */}
            <main className={mainClassName ?? ''}>
                <Suspense fallback={<PageFallback />}>
                    <Outlet />
                </Suspense>
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;

function PageFallback() {
    return (
        <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="animate-pulse rounded-2xl border border-edubot-line bg-white p-6 shadow-sm">
                <div className="h-5 w-36 rounded bg-edubot-line" />
                <div className="mt-5 h-9 w-2/3 max-w-xl rounded bg-edubot-line" />
                <div className="mt-4 h-4 w-full max-w-2xl rounded bg-edubot-line" />
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-40 rounded-xl bg-edubot-surfaceAlt" />
                    ))}
                </div>
            </div>
        </div>
    );
}
