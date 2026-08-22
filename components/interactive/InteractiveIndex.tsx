"use client";

import Link from "next/link";
import FixedNavigation from "@/components/FixedNavigation";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function InteractiveIndex() {
  const { t } = useLocale();

  return (
    <div className="coloring-page relative min-h-screen bg-parchment">
      <FixedNavigation />
      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-24">
        <h1 className="font-serif text-2xl text-ink">{t("interactive.title")}</h1>
        <p className="mt-3 max-w-md text-center font-serif text-sm text-ink/65">
          {t("interactive.lead")}
        </p>
        <ul className="mt-8 space-y-3">
          <li>
            <Link
              href="/interactive/color-the-mural"
              className="block rounded-sm border border-ink/15 bg-rice/80 px-6 py-4 font-serif text-ink transition-colors hover:border-ink/30"
            >
              {t("interactive.color")}
              <span className="mt-1 block font-sans text-[10px] tracking-wider text-stone">
                {t("interactive.colorHint")}
              </span>
            </Link>
          </li>
        </ul>
        <Link
          href="/"
          className="mt-10 font-sans text-xs text-ink/50 hover:text-ink"
        >
          {t("interactive.home")}
        </Link>
      </main>
    </div>
  );
}
