import React, { createContext, useContext, useState } from 'react';
import i18n from '../utils/Translation/translations';


interface LanguageContextType {
  locale: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'es',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  const setLanguage = (lang: string) => {
    i18n.locale = lang;
    setLocale(lang);
  };

  // Función de traducción rápida
  const t = (key: string) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);