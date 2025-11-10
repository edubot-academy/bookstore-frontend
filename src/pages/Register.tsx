import { type JSX, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register(): JSX.Element {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            await register({ fullName, email, password, phone: phone || undefined });
            navigate('/');
        } catch (e: any) {
            setErr(e?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-md px-4 py-12">
            <h1 className="mb-6 text-2xl font-bold">Create account</h1>
            <form onSubmit={onSubmit} className="space-y-4">
                {err && <div className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">{err}</div>}

                <div>
                    <label className="block text-sm mb-1">Full name</label>
                    <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

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
                    <label className="block text-sm mb-1">Phone (optional)</label>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                    {loading ? 'Creating…' : 'Register'}
                </button>
            </form>

            <p className="mt-4 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
