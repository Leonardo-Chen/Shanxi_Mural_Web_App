"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/i18n/LocaleProvider";

interface ColoringIntroProps {
  onStart: () => void;
}

export default function ColoringIntro({ onStart }: ColoringIntroProps) {
  const reducedMotion = useReducedMotion();
  const { t } = useLocale();

  return (
    <div
      className={`absolute inset-0 z-30 flex items-center justify-center bg-parchment/75 backdrop-blur-[2px] ${
        reducedMotion ? "" : "animate-[fadeScale_0.7s_ease-out]"
      }`}
    >
      <div className="max-w-md px-6 text-center">
        <h2 className="font-serif text-2xl text-ink md:text-3xl">
          {t("interactive.color")}
        </h2>
        <p className="mt-2 font-sans text-xs tracking-[0.2em] text-stone">
          {t("interactive.colorHint")}
        </p>
        <p className="mt-6 font-serif text-sm leading-relaxed text-ink/75">
          {t("color.intro")}
        </p>
        <button
          type="button"
          onClick={onStart}
          className="mt-8 rounded-sm bg-cinnabar px-8 py-3 font-sans text-xs tracking-wider text-rice transition-colors hover:bg-cinnabar/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
        >
          {t("color.start")}
        </button>
        <p className="mt-4 font-serif text-[11px] text-ink/50">
          {t("color.introNote")}
        </p>
      </div>
    </div>
  );
}
