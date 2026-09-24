import React, { useContext, useEffect, createContext, useState } from "react";
import { supabase } from "../lib/supabase";
import { loginConGoogle } from "../lib/auth";

type User = {
  email: string;
  fullName?: string;
  career?: string;
  authToken?: string;
  sessionToken?: string;
  role?: string;
} | null;

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (email: string, pwd: string, meta?: { fullName?: string; career?: string; phone?: string }) => Promise<void>;
  login: (email: string, pwd: string) => Promise<void>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Convierte el usuario de Supabase al formato de la app
const mapUser = (u: any, fallbackEmail = ""): User => ({
  email: u?.email ?? fallbackEmail,
  fullName: u?.user_metadata?.full_name ?? u?.user_metadata?.name,
  career: u?.user_metadata?.career,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(mapUser(session.user));
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? mapUser(session.user) : null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const register = async (
    email: string,
    pwd: string,
    meta?: { fullName?: string; career?: string; phone?: string }
  ) => {
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
    if (data.user) setUser(mapUser(data.user, email));
  };

  const login = async (email: string, pwd: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    if (error) throw error;
    if (data.user) setUser(mapUser(data.user, email));
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const session = await loginConGoogle();
      // El usuario también se actualiza solo por onAuthStateChange
      if (session?.user) setUser(mapUser(session.user));
      return !!session;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
  return context;
};