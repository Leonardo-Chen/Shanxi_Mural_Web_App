import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Noto_Serif_SC, Inter } from "next/font/google";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { HTML_LANG, STORAGE_KEY, isLocale } from "@/lib/i18n/locales";
import { localeMetadata } from "@/lib/i18n/requestLocale";
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
  const cookieStore = await cookies();
  const raw = cookieStore.get(STORAGE_KEY)?.value;
  const locale = isLocale(raw) ? raw : "zh";

  return (
    <html lang={HTML_LANG[locale]}>
      <body
        className={`${notoSerif.variable} ${inter.variable} font-sans antialiased`}
      >
        <LocaleProvider initialLocale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
