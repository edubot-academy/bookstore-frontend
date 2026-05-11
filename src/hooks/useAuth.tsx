import React from 'react';
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout, api, type AuthUser } from '../lib/api';

export type User = AuthUser;

type AuthContextShape = {
    user: User | null;
    loading: boolean;
    login: (payload: { email: string; password: string }) => Promise<User>;
    register: (payload: { fullName: string; email: string; password: string; phone?: string }) => Promise<User>;
    logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextShape | null>(null);

// Tiny token helpers (adapt to your project conventions)
const tokenKey = 'token';
const getToken = () => localStorage.getItem(tokenKey) || '';
const setToken = (t?: string) => {
    if (t) localStorage.setItem(tokenKey, t);
    else localStorage.removeItem(tokenKey);
    // keep your api client in sync
    if (t) api.defaults.headers.Authorization = `Bearer ${t}`;
    else delete api.defaults.headers.Authorization;
};

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, setUser] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);

    // on mount: hydrate token -> set header -> fetch me
    React.useEffect(() => {
        const token = getToken();
        if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
        (async () => {
            try {
                if (token) {
                    const me = await getMe();
                    setUser(me as User);
                }
            } catch {
                // invalid token -> clear
                setToken(undefined);
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = React.useCallback(async (payload: { email: string; password: string }) => {
        const res = await apiLogin(payload);
        if (res.accessToken) setToken(res.accessToken);
        const me: User = res.user ?? (await getMe());
        setUser(me);
        return me;
    }, []);

    const register = React.useCallback(async (payload: { fullName: string; email: string; password: string; phone?: string }) => {
        const res = await apiRegister(payload);
        if (res.accessToken) setToken(res.accessToken);
        const me: User = res.user ?? (await getMe());
        setUser(me);
        return me;
    }, []);

    const logout = React.useCallback(async () => {
        try {
            await apiLogout(); // optional if backend is stateless
        } finally {
            setToken(undefined);
            setUser(null);
        }
    }, []);

    // Optional: auto sign-out on 401s from anywhere
    React.useEffect(() => {
        const id = api.interceptors.response.use(
            (r) => r,
            (error) => {
                if (error?.response?.status === 401) {
                    setToken(undefined);
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(id);
    }, []);

    const value = React.useMemo<AuthContextShape>(() => ({
        user, loading, login, register, logout
    }), [user, loading, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = React.useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}
