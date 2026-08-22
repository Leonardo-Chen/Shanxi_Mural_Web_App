"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface SiteBrandProps {
  compact?: boolean;
  href?: string | null;
  size?: "nav" | "intro";
  onClick?: () => void;
}

export default function SiteBrand({
  compact = false,
  href = "/",
  size = "nav",
  onClick,
}: SiteBrandProps) {
  const { t } = useLocale();
  const isIntro = size === "intro";
  const logoPx = isIntro ? 72 : compact ? 36 : 44;

  const content = (
    <div
      className={`flex items-center ${
        isIntro ? "flex-col gap-5" : "gap-3"
      }`}
    >
      <Image
        src="/images/Jin_logo.png"
        alt={t("brand.logoAlt")}
        width={logoPx}
        height={logoPx}
        priority={isIntro}
        className={`shrink-0 object-contain ${
          isIntro ? "h-[72px] w-[72px] md:h-20 md:w-20" : compact ? "h-9 w-9" : "h-11 w-11"
        }`}
      />
      <div className={isIntro ? "text-center" : ""}>
        <h1
          className={`font-serif text-ink transition-all duration-700 ${
            isIntro
              ? "text-4xl tracking-wide md:text-5xl"
              : compact
                ? "text-lg md:text-xl"
                : "text-2xl md:text-3xl"
          }`}
        >
          {t("brand.siteName")}
        </h1>
        <p
          className={`font-sans text-stone transition-all duration-700 ${
            isIntro
              ? "mt-3 text-xs tracking-[0.35em]"
              : compact
                ? "mt-0.5 text-[8px] tracking-[0.25em] md:text-[9px]"
                : "mt-1 text-[10px] tracking-[0.25em] md:text-xs"
          }`}
        >
          {t("brand.siteSubtitle")}
        </p>
      </div>
    </div>
  );

  const className =
    "pointer-events-auto block transition-opacity hover:opacity-85 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        aria-label={t("brand.backToCover")}
      >
        {content}
      </button>
    );
  }

  if (!href) return content;

  return (
    <Link
      href={href}
      className={className}
      aria-label={t("brand.backToHome")}
    >
      {content}
    </Link>
  );
}
