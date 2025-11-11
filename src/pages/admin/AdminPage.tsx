import * as React from 'react';
import DashboardTab from './tabs/DashboardTab';
import HomeCMSTab from './tabs/HomeCMSTab';
import OrdersTab from './tabs/OrdersTab';
import BooksTab from './tabs/BooksTab';
import CategoriesTab from './tabs/CategoriesTab';
import AuthorsTab from './tabs/AuthorsTab';
import SettingsTab from './tabs/SettingsTab';
import { Button } from './ui/Inputs';

/**
 * AdminPage — full Admin UI (Dashboard, Orders, Books, Categories, Authors, Home CMS, Settings)
 * - Uses your provided endpoints for create/update/delete and image uploads
 * - Adds GET list/read helpers inside this file for convenience
 * - Splits UI into small components (in-file) to keep routing simple
 * - Tailwind classes align with your design tokens (border-border, text-dark, text-text-muted, primary, neutral)
 */


// ---------------- Root Page ----------------
export default function AdminPage() {
    const [tab, setTab] = React.useState<'dashboard' | 'orders' | 'books' | 'categories' | 'authors' | 'cms' | 'settings'>('dashboard');
    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            {/* Tabs */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                {([
                    ['dashboard', 'Dashboard'],
                    ['orders', 'Orders'],
                    ['books', 'Books'],
                    ['categories', 'Categories'],
                    ['authors', 'Authors'],
                    ['cms', 'Home CMS'],
                    ['settings', 'Settings'],
                ] as const).map(([key, label]) => (
                    <Button key={key}
                        onClick={() => setTab(key as any)}
                        className={`border ${tab === key ? 'border-dark text-dark' : 'border-border text-dark/70'} bg-white`}
                    >{label}</Button>
                ))}
            </div>

            {tab === 'dashboard' && <DashboardTab />}
            {tab === 'orders' && <OrdersTab />}
            {tab === 'books' && <BooksTab />}
            {tab === 'categories' && <CategoriesTab />}
            {tab === 'authors' && <AuthorsTab />}
            {tab === 'cms' && <HomeCMSTab />}
            {tab === 'settings' && <SettingsTab />}
        </div>
    );
}


