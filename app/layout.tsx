import type { Metadata } from "next";
import AppI18n from "@/components/i18n/AppI18n";
import { HTML_LANG } from "@/lib/i18n/locales";
import { localeMetadata, getRequestLocale } from "@/lib/i18n/requestLocale";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  return localeMetadata("meta.title", "meta.description");
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  return (
    <html lang={HTML_LANG[locale]}>
      <body className="font-sans antialiased">
        <AppI18n initialLocale={locale}>{children}</AppI18n>
      </body>
    </html>
  );
}
