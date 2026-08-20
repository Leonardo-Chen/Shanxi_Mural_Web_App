"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAX_STARS, useGameProgress } from "@/hooks/useGameProgress";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function StarCounter() {
  const pathname = usePathname();
  const { progress } = useGameProgress();
  const { t } = useLocale();
  const stars = Math.min(MAX_STARS, progress.stars);
  const label = t("nav.starsAria", { stars, max: MAX_STARS });
  const className =
    "flex min-h-9 items-center gap-1.5 border border-stone/15 bg-rice/90 px-3 py-2 text-stone shadow-sm transition-colors hover:border-stone/40 hover:bg-rice focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar";

  const content = Array.from({ length: MAX_STARS }, (_, index) => (
    <span
      key={index}
      className={index < stars ? "text-[#A77B25]" : "text-stone/30"}
      aria-hidden="true"
    >
      {index < stars ? "★" : "☆"}
    </span>
  ));

  if (pathname === "/postcards") {
    return (
      <div id="star-hud" className={className} aria-current="page" aria-label={label}>
        {content}
      </div>
    );
  }

  return (
    <Link id="star-hud" href="/postcards" className={className} aria-label={label}>
      {content}
    </Link>
  );
}
