import React from 'react';
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
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
