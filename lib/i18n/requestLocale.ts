import { cookies } from "next/headers";
import { STORAGE_KEY, isLocale, type Locale } from "./locales";
import { messages, type MessageKey } from "./messages";

export async function getRequestLocale(): Promise<Locale> {
  const raw = (await cookies()).get(STORAGE_KEY)?.value;
  return isLocale(raw) ? raw : "zh";
}

export async function localeMetadata(
  titleKey: MessageKey,
  descriptionKey: MessageKey
) {
  const locale = await getRequestLocale();
  const table = messages[locale];
  return {
    title: table[titleKey],
    description: table[descriptionKey],
  };
}
