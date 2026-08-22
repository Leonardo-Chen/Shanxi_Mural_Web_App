import type { Metadata } from "next";
import { Noto_Serif_SC, Inter } from "next/font/google";
import AppI18n from "@/components/i18n/AppI18n";
import { HTML_LANG } from "@/lib/i18n/locales";
import { getRequestLocale, localeMetadata } from "@/lib/i18n/requestLocale";
import "./globals.css";

const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
      <body
        className={`${notoSerif.variable} ${inter.variable} font-sans antialiased`}
      >
        <AppI18n initialLocale={locale}>{children}</AppI18n>
      </body>
    </html>
  );
}
