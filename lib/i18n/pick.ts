import type { Locale } from "./locales";

export type LText = {
  zh: string;
  en: string;
  it: string;
};

export type Pair = { en: string; it: string };

export type MuralOverlay = {
  title: Pair;
  displayTitle: Pair;
  summary: Pair;
  detailedDescription: Pair;
  readingGuide: Pair[];
  location: Pair;
  locationPrecision: Pair;
};

export type ElementOverlay = {
  name: Pair;
  desc: Pair;
};

export function locPair(locale: Locale, zh: string, pair?: Pair): string {
  if (locale === "zh" || !pair) return zh;
  return locale === "it" ? pair.it || pair.en || zh : pair.en || zh;
}

export function pickL(
  locale: Locale,
  text: LText | undefined,
  fallback = ""
): string {
  if (!text) return fallback;
  return text[locale] || text.en || text.zh || fallback;
}

export function pickTerm(
  locale: Locale,
  table: Record<string, LText>,
  key: string
): string {
  return pickL(locale, table[key], key);
}
