"use client";

import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { BgmProvider } from "@/components/BgmPlayer";
import type { Locale } from "@/lib/i18n/locales";

export default function AppI18n({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider initialLocale={initialLocale}>
      <BgmProvider>{children}</BgmProvider>
    </LocaleProvider>
  );
}
