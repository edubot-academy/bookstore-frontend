import { type JSX, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login(): JSX.Element {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/');
        } catch (e: any) {
            setErr(e?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-12">
            <h1 className="mb-6 text-2xl font-bold">Login</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                {err && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">{err}</div>}
                <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
                >
                    {loading ? 'Signing in…' : 'Login'}
                </button>
            </form>

            <p className="mt-4 text-sm">
                No account?{' '}
                <Link to="/register" className="text-primary hover:underline">
                    Register
                </Link>
            </p>
        </div>
    );
}
