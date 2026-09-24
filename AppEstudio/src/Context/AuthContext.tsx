import React, { useContext, useEffect } from "react";
import { createContext, useState } from "react";
import { supabase } from "../lib/supabase";

type User = {
    email: string;
    fullName?: string;
    career?: string;
    authToken?: string;
    sessionToken?: string;
    role?: string;
} | null

type AuthContextType = {
    user: User | null;
    loading: boolean;
    register: (email: string, pwd: string, meta?: { fullName?: string; career?: string; phone?: string }) => Promise<void>;
    login: (email: string, pwd: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    email: session.user.email ?? '',
                    fullName: session.user.user_metadata?.full_name,
                    career: session.user.user_metadata?.career,
                });
            }
            setLoading(false);
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    email: session.user.email ?? '',
                    fullName: session.user.user_metadata?.full_name,
                    career: session.user.user_metadata?.career,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    const register = async (email: string, pwd: string, meta?: { fullName?: string; career?: string; phone?: string }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password: pwd,
            options: {
                data: {
                    full_name: meta?.fullName,
                    career: meta?.career,
                    phone: meta?.phone,
                },
            },
        });

        if (error) throw error;

        if (data.user) {
            setUser({
                email: data.user.email ?? email,
                fullName: data.user.user_metadata?.full_name,
                career: data.user.user_metadata?.career,
            });
        }
    }

    const login = async (email: string, pwd: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;

        if (data.user) {
            setUser({
                email: data.user.email ?? email,
                fullName: data.user.user_metadata?.full_name,
                career: data.user.user_metadata?.career,
            });
        }
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
    return context;
}