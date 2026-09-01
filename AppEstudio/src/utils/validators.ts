export const isRequired = (value: string): boolean => value.trim().length > 0;

export const isValidEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPassword = (value: string): boolean => value.length >= 6;

export const isValidPhone = (value: string): boolean =>
  /^[0-9]{8}$/.test(value.replace(/[\s-]/g, ""));

export const isValidText = (value: string, minLength: number = 2): boolean =>
  value.trim().length >= minLength;

export function getFieldError(
  type: "default" | "text" | "password" | "email" | "phone",
  value: string,
  required: boolean = true
): string | null {
  if (required && !isRequired(value)) {
    return "Este campo es obligatorio";
  }
  if (!isRequired(value)) {
    return null;
  }
  switch (type) {
    case "email":
      return isValidEmail(value) ? null : "Correo inválido";
    case "password":
      return isValidPassword(value) ? null : "La contraseña debe tener al menos 6 caracteres";
    case "phone":
      return isValidPhone(value) ? null : "Teléfono inválido (8 dígitos)";
    case "text":
      return isValidText(value) ? null : "Debe tener al menos 2 caracteres";
    default:
      return null;
  }
}