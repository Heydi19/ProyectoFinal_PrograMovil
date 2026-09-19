import React, { useContext } from "react";
import { createContext, useState } from "react";
import { supabase } from "../lib/supabase";

//1. tipado del objeto principal del contexto
type User = {
    email: string;
    authToken? :string;
    sessionToken? : string;
    role?: string;
} | null

type AuthContextType ={
    user: User | null;
    register: (email: string, pwd: string) => Promise<void>;
    login: (email: string, pwd: string) => Promise<void> ;
    logout: ()=> Promise<void>;
}

//2. creacion del contexto 
const AuthContext = createContext<AuthContextType | null>(null);

//3. creacion del provider: medio por el cual manejamos el estado desde otras pantallas
export const AuthProvider = ({children}: {children: React.ReactNode}) =>{
    //declaracion de las 3 propiedad del contexto
    const [user, setUser] = useState<User>(null);

    const register = async (email: string, pwd: string) =>{
    const { data, error } = await supabase.auth.signUp({
    email: 'example@email.com',
    password: 'example-password',
    })

    if (error) throw error;
        
}

    const login = async (email: string, pwd: string) =>{
        const { error } = await supabase.auth.signInWithPassword({email, password:pwd});
         if (error) throw error;
       
    }
    const logout = async () =>{
        const { error } = await supabase.auth.signOut()
        
    }
    return (
        <AuthContext.Provider value={{user,register, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

// 4. hook personalizado: exposicion del contexto a componentes de la aplicacion
export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth debe ser utilizado dentro de AuthProvider");
    return context;
}