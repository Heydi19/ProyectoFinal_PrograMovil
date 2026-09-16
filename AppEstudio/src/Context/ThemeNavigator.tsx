import {createContext, useContext, useState, ReactNode, Children} from 'react';

//Paleta de colores para el tema claro
const lightColors = {
  background: '#ffffff',
  surface: '#F5F5F5',
  text: '#1a1a1a',
  textSecondary: '#666666',
  primary: '#206291',
  border: '#E0E0E0',
  cardbackground: '#ffffff',
  cardBorder: '#E0E0E0',
};

//Paleta de colores para el tema oscuro
const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#4fc3f7',
  border: '#2c2c2c',
    cardbackground: '#2c2c2c',
    cardBorder: '#444444',
};

//Tipo inferido de los colores (ambos tienen la misma forma)
export type ThemeColors = typeof lightColors;

//Tipo del valor que expone el Context
type ThemeContextType = {
    isDark: boolean;
    colors: ThemeColors;
    toggleTheme: () => void;
};

//Crea el Context (Valor inicial undefined, se valida en el hook)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//Provider: este envuelve la app y provee el tema a todos los hijos
export const ThemeProvider = ({children}: {children: ReactNode}) => {
    const [isDark, setIsDark] = useState(false);

    const colors = isDark ? darkColors : lightColors;
    const toggleTheme = () => setIsDark (prev => !prev);

    return(
        <ThemeContext.Provider value={{isDark, colors, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
}

//Hook personalizado paraa consumir el context de forma segura 
export function useTheme(){
    const ctx = useContext(ThemeContext);
    if (!ctx){
        throw new Error ('useTheme dee usarse dentro de ThemeProvider');
    }
    return ctx;
}