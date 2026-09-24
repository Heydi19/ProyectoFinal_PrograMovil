import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const translations = {
  es: {
    // Generales
    welcome: "¡Hola de nuevo!",
    tasks: "Tareas Pendientes",
    dark_mode: "Modo Oscuro",
    logout: "Cerrar Sesión",
    settings: "Ajustes",
    hours: "Horas",
    exams: "Exámenes",
    profile: "Perfil",

    // Login
    login_title: "Iniciar Sesión",
    login_email_placeholder: "Ingresa tu correo",
    login_password_placeholder: "Ingresa tu contraseña",
    login_button: "Iniciar Sesión",
    login_no_account: "¿No tienes cuenta? Regístrate aquí",
    login_error_empty: "Por favor ingresa tu correo y contraseña",
    login_error_title: "Error al iniciar sesión",
    login_error_default: "Correo o contraseña incorrectos.",

    // Register
    register_title: "Crear Cuenta",
    register_subtitle: "Completa tus datos para empezar",
    register_fullname_placeholder: "Nombre completo",
    register_email_placeholder: "Correo electrónico",
    register_phone_placeholder: "Número de teléfono (opcional)",
    register_password_placeholder: "Contraseña",
    register_career_placeholder: "Carrera",
    register_button: "Registrarse",
    register_have_account: "¿Ya tienes cuenta? ",
    register_login_link: "Inicia sesión aquí",
    register_success_title: "¡Registro Exitoso!",
    register_success_message: "Tu cuenta ha sido creada correctamente.",
    register_continue: "Continuar",
    register_error_title: "Error al registrarse",
    register_error_default: "No se pudo crear la cuenta. Intenta de nuevo.",
    register_incomplete_title: "Campos incompletos",
    register_incomplete_message: "Por favor llena todos los campos obligatorios.",
    register_invalid_email_title: "Email inválido",
    register_invalid_email_message: "Por favor ingresa un formato de correo electrónico válido.",
    register_edu_email_title: "Correo no permitido",
    register_edu_email_message: "Debes registrarte con un correo institucional (que contenga \".edu\").",
    register_invalid_phone_title: "Teléfono inválido",
    register_invalid_phone_message: "El número de teléfono debe contener entre 8 y 15 dígitos numéricos.",
    register_weak_password_title: "Contraseña débil",
    register_weak_password_message: "La contraseña debe tener al menos 6 caracteres.",

    // Cambiar contraseña
    change_password_short_title: "Contraseña muy corta",
    change_password_short: "La contraseña debe tener al menos 6 caracteres.",
    change_password_mismatch_title: "No coinciden",
    change_password_mismatch: "Las contraseñas no coinciden.",
    change_password_success_title: "¡Listo!",
    change_password_success: "Contraseña actualizada correctamente.",
    change_password_generic_error: "No se pudo actualizar la contraseña.",
  },
  en: {
    // Generales
    welcome: "Welcome back!",
    tasks: "Pending Tasks",
    dark_mode: "Dark Mode",
    logout: "Log Out",
    settings: "Settings",
    hours: "Hours",
    exams: "Exams",
    profile: "Profile",

    // Login
    login_title: "Log In",
    login_email_placeholder: "Enter your email",
    login_password_placeholder: "Enter your password",
    login_button: "Log In",
    login_no_account: "Don't have an account? Sign up here",
    login_error_empty: "Please enter your email and password",
    login_error_title: "Login error",
    login_error_default: "Incorrect email or password.",

    // Register
    register_title: "Create Account",
    register_subtitle: "Complete your info to get started",
    register_fullname_placeholder: "Full name",
    register_email_placeholder: "Email",
    register_phone_placeholder: "Phone number (optional)",
    register_password_placeholder: "Password",
    register_career_placeholder: "Major/Career",
    register_button: "Sign Up",
    register_have_account: "Already have an account? ",
    register_login_link: "Log in here",
    register_success_title: "Registration Successful!",
    register_success_message: "Your account has been created successfully.",
    register_continue: "Continue",
    register_error_title: "Registration error",
    register_error_default: "Could not create the account. Please try again.",
    register_incomplete_title: "Incomplete fields",
    register_incomplete_message: "Please fill in all required fields.",
    register_invalid_email_title: "Invalid email",
    register_invalid_email_message: "Please enter a valid email format.",
    register_edu_email_title: "Email not allowed",
    register_edu_email_message: "You must register with an institutional email (containing \".edu\").",
    register_invalid_phone_title: "Invalid phone",
    register_invalid_phone_message: "Phone number must contain between 8 and 15 digits.",
    register_weak_password_title: "Weak password",
    register_weak_password_message: "Password must be at least 6 characters long.",

    // Change password
    change_password_short_title: "Password too short",
    change_password_short: "Password must be at least 6 characters.",
    change_password_mismatch_title: "Doesn't match",
    change_password_mismatch: "Passwords do not match.",
    change_password_success_title: "Done!",
    change_password_success: "Password updated successfully.",
    change_password_generic_error: "Could not update the password.",
  },
};

const i18n = new I18n(translations);

const deviceLanguage = Localization.getLocales()[0]?.languageCode || 'es';

i18n.locale = deviceLanguage;
i18n.enableFallback = true;
i18n.defaultLocale = 'es';

export default i18n;