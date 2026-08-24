"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAX_STARS, useGameProgress } from "@/hooks/useGameProgress";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function StarCounter({
  className = "nav-chip gap-2",
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const { t } = useLocale();
  const { progress } = useGameProgress();
  const stars = Math.min(MAX_STARS, progress.stars);
  const label = t("nav.starsAria", { stars, max: MAX_STARS });

  const content = Array.from({ length: MAX_STARS }, (_, index) => {
    const earned = index < stars;
    return (
      <span
        key={index}
        className={`inline-flex h-[18px] w-[18px] items-center justify-center ${
          earned ? "star-twinkle text-gold" : ""
        }`}
        style={earned ? { animationDelay: `${index * 180}ms` } : undefined}
        aria-hidden="true"
      >
        {earned ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
            <path d="M9 1.6 11.1 6l4.9.7-3.5 3.4.8 4.9L9 12.7 4.7 15l.8-4.9L2 6.7 6.9 6 9 1.6Z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="rgb(33 51 56 / 0.28)">
            <path d="M9 1.6 11.1 6l4.9.7-3.5 3.4.8 4.9L9 12.7 4.7 15l.8-4.9L2 6.7 6.9 6 9 1.6Z" />
          </svg>
        )}
      </span>
    );
  });

  if (pathname === "/postcards") {
    return (
      <div id="star-hud" className={`${className} star-hud`} aria-current="page" aria-label={label}>
        {content}
      </div>
    );
  }

  return (
    <Link id="star-hud" href="/postcards" className={`${className} star-hud`} aria-label={label}>
      {content}
    </Link>
  );
}
