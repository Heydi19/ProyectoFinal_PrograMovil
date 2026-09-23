declare const i18n: {
  locale: string;
  defaultLocale: string;
  enableFallback: boolean;
  t: (key: string, options?: Record<string, any>) => string;
};

export default i18n;