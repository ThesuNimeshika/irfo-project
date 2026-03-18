import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        return sessionStorage.getItem('irfo_auth') === 'true';
    });

    const login = () => {
        sessionStorage.setItem('irfo_auth', 'true');
        setIsAuthenticated(true);
    };

    const logout = () => {
        sessionStorage.removeItem('irfo_auth');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
