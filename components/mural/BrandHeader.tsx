"use client";

import Image from "next/image";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface BrandHeaderProps {
  mode: "cover" | "home";
  onLogoClick?: () => void;
}

export default function BrandHeader({ mode, onLogoClick }: BrandHeaderProps) {
  const { t, locale } = useLocale();

  return (
    <div className={`flex items-center gap-3 ${mode === "cover" ? "max-w-[min(28rem,70vw)]" : ""}`}>
      <button
        type="button"
        onClick={onLogoClick}
        className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
        aria-label={t("brand.backToCover")}
      >
        <Image
          src="/images/Jin_logo.png"
          alt={t("brand.logoAlt")}
          width={48}
          height={48}
          priority
          className="h-11 w-11 object-contain md:h-12 md:w-12"
        />
      </button>

      {mode === "cover" ? (
        <div>
          <p className="font-serif text-[15px] leading-tight text-stone md:text-base">
            {t("cover.navTitle")}
          </p>
          <p
            className={`mt-0.5 font-sans text-stone/75 ${
              locale === "zh"
                ? "text-[8px] tracking-[0.32em] md:text-[9px]"
                : "text-[8px] tracking-[0.18em] md:text-[9px]"
            }`}
          >
            {t("cover.subtitle")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
