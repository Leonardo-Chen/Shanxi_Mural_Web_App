export const LOCALES = ["zh", "en", "it"] as const;

export type Locale = (typeof LOCALES)[number];

export const STORAGE_KEY = "shanxi-locale";

export const LOCALE_SHORT: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
  it: "IT",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  it: "Italiano",
};

export const HTML_LANG: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en",
  it: "it",
};

export function isLocale(value: unknown): value is Locale {
  return value === "zh" || value === "en" || value === "it";
}
