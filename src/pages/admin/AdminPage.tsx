import * as React from 'react';
import DashboardTab from './tabs/DashboardTab';
import HomeCMSTab from './tabs/HomeCMSTab';
import OrdersTab from './tabs/OrdersTab';
import BooksTab from './tabs/BooksTab';
import CategoriesTab from './tabs/CategoriesTab';
import AuthorsTab from './tabs/AuthorsTab';
import SettingsTab from './tabs/SettingsTab';
import { BarChart3, BookOpen, FileText, Layers, ListTree, Settings, ShoppingBag } from 'lucide-react';

export default function AdminPage() {
    const [tab, setTab] = React.useState<'dashboard' | 'orders' | 'books' | 'categories' | 'authors' | 'cms' | 'settings'>('dashboard');
    const tabs = [
        ['dashboard', 'Башкы панель', BarChart3],
        ['orders', 'Буйрутмалар', ShoppingBag],
        ['books', 'Китептер', BookOpen],
        ['categories', 'Категориялар', ListTree],
        ['authors', 'Авторлор', FileText],
        ['cms', 'Башкы бет контенти', Layers],
        ['settings', 'Жөндөөлөр', Settings],
    ] as const;

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-edubot-dark">EduBook башкаруу панели</h1>
                <p className="mt-1 text-sm text-edubot-muted">Каталогду, буйрутмаларды, кампадагы калдыкты жана китеп маалыматтарын башкарыңыз.</p>
            </div>
            <div className="mb-6 overflow-x-auto rounded-2xl border border-edubot-line bg-white p-2 shadow-sm">
                <div className="flex min-w-max items-center gap-1">
                    {tabs.map(([key, label, Icon]) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${tab === key ? 'bg-edubot-orange text-white shadow-edubot-soft' : 'text-edubot-ink/70 hover:bg-edubot-surfaceAlt hover:text-edubot-dark'}`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    ))}
                </div>
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
