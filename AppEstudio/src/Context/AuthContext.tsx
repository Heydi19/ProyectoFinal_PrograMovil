import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { supabase } from "../lib/supabase";

// 1. Tipado del objeto principal del contexto
type User = {
    email: string;
    authToken?: string;
    sessionToken?: string;
    role?: string;
} | null;

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
};

// 2. Creación del contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 3. Creación del provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    // Revisa si ya hay una sesión activa al abrir la app,
    // y se suscribe a cambios de sesión (login/logout desde cualquier parte)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user?.email) {
                setUser({ email: session.user.email });
            }
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email) {
                setUser({ email: session.user.email });
            } else {
                setUser(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }
        setUser({ email: data.user?.email ?? email });
        return { success: true };
    };

    const register = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            return { success: false, message: error.message };
        }
        // Si tu proyecto pide confirmación por correo, data.user existe pero no hay sesión activa todavía
        if (data.user) {
            setUser({ email: data.user.email ?? email });
        }
        return { success: true };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Hook personalizado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
    }
    return context;
};