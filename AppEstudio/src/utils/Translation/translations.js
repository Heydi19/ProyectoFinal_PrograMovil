import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

// 1. Definir los textos en los idiomas soportados
const translations = {
  es: {
    welcome: "¡Hola de nuevo!",
    tasks: "Tareas Pendientes",
    dark_mode: "Modo Oscuro",
    logout: "Cerrar Sesión",
    settings: "Ajustes",
    hours: "Horas",
    exams: "Exámenes",
    profile: "Perfil",
  },
  en: {
    welcome: "Welcome back!",
    tasks: "Pending Tasks",
    dark_mode: "Dark Mode",
    logout: "Log Out",
    settings: "Settings",
    hours: "Hours",
    exams: "Exams",
    profile: "Profile",
  },
};

// 2. Inicializar I18n
const i18n = new I18n(translations);

// 3. Obtener el idioma del sistema del teléfono
const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'es';

i18n.locale = deviceLanguage;
i18n.enableFallback = true; // Si el idioma no existe, usa el predeterminado (español)
i18n.defaultLocale = 'es';

export default i18n;