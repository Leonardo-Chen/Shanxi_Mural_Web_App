"use client";

import StartExploreButton from "./StartExploreButton";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface CoverIntroProps {
  visible: boolean;
  pressed: boolean;
  transitioning: boolean;
  onStart: () => void;
  chromeRef: React.RefObject<HTMLDivElement | null>;
}

export default function CoverIntro({
  visible,
  pressed,
  transitioning,
  onStart,
  chromeRef,
}: CoverIntroProps) {
  const { t, locale } = useLocale();

  return (
    <div
      ref={chromeRef}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={transitioning ? undefined : { opacity: visible ? 1 : 0 }}
      aria-hidden={!visible}
    >
      <div className="relative z-10 flex w-full max-w-2xl -translate-y-6 flex-col items-center px-6 text-center md:-translate-y-10">
        <h1
          className={`font-serif font-normal leading-[1.12] text-stone ${
            locale === "zh"
              ? "text-[2.4rem] tracking-[0.06em] md:text-[3.5rem] lg:text-[3.85rem]"
              : "text-[1.85rem] tracking-wide md:text-[2.75rem] lg:text-[3.1rem]"
          }`}
        >
          {t("cover.title")}
        </h1>
        <p
          className={`mt-3.5 font-sans text-stone/70 md:mt-4 ${
            locale === "zh"
              ? "text-[9px] tracking-[0.48em] md:text-[11px]"
              : "text-[10px] tracking-[0.22em] md:text-[12px]"
          }`}
        >
          {t("cover.subtitle")}
        </p>
        <div
          className={`mt-8 md:mt-10 ${visible ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <StartExploreButton
            onClick={onStart}
            disabled={!visible || pressed}
            pressed={pressed}
            label={t("cover.start")}
            hint={t("cover.startHint")}
          />
        </div>
      </div>
    </div>
  );
}
