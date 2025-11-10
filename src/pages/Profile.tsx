import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Profile(): JSX.Element {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="px-4 py-12">Loading…</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="mx-auto max-w-3xl px-4 py-12">
            <h1 className="mb-6 text-2xl font-bold">My Profile</h1>
            <div className="rounded-2xl border bg-white p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={user.avatarUrl || 'https://placehold.co/80x80?text=U'}
                        className="h-20 w-20 rounded-full object-cover"
                    />
                    <div>
                        <div className="text-xl font-semibold">{user.fullName}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{user.phone || '—'}</div>
                    </div>
                    <div className="rounded-xl border p-4">
                        <div className="text-sm text-gray-500">Member ID</div>
                        <div className="font-medium">#{user.id}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
