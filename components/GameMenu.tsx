"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { BgmToggle } from "./BgmPlayer";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function GameMenu() {
  const { t } = useLocale();
  const pathname = usePathname();
  const isPostcards = pathname === "/postcards";

  return (
    <nav
      aria-label={t("nav.menu")}
      className="flex flex-wrap items-center justify-end gap-2 [&_.nav-chip]:rounded-full"
    >
      {!isPostcards ? (
        <Link
          href="/postcards"
          className="hud-badge type-ui"
        >
          {t("nav.postcards")}
        </Link>
      ) : null}
      <LanguageSwitcher />
      <BgmToggle />
    </nav>
  );
}
