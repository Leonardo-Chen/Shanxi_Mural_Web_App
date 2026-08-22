"use client";

import { useEffect, useRef } from "react";
import { locMural } from "@/lib/i18n/localize";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Mural } from "@/data/murals";

interface MatchingFeedbackProps {
  result: "correct" | "incorrect";
  earnedStar: boolean;
  mural?: Mural | null;
  onDismiss: () => void;
  onLearnMore: () => void;
  onChooseAnother: () => void;
}

export default function MatchingFeedback({
  result,
  earnedStar,
  mural,
  onDismiss,
  onLearnMore,
  onChooseAnother,
}: MatchingFeedbackProps) {
  const { locale, t } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const isCorrect = result === "correct";
  const localized = mural ? locMural(locale, mural) : null;

  useEffect(() => {
    cardRef.current?.focus();
  }, [result]);

  useEffect(() => {
    if (isCorrect) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCorrect, onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-parchment/30 px-5 backdrop-contrast-75"
      role="presentation"
      onClick={isCorrect ? undefined : onDismiss}
    >
      <div
        ref={cardRef}
        role={isCorrect ? "dialog" : "status"}
        aria-modal={isCorrect ? true : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full max-w-md border bg-rice px-7 py-8 text-center shadow-[0_20px_55px_rgba(38,36,31,0.2)] focus:outline-none ${
          isCorrect ? "border-stone/25" : "border-cinnabar/35"
        }`}
      >
        <span
          className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full border ${
            isCorrect
              ? "border-[#B08A3C]/40 text-[#A77B25]"
              : "border-cinnabar/35 text-cinnabar"
          }`}
          aria-hidden="true"
        >
          {isCorrect ? "★" : "×"}
        </span>

        <p className="mt-5 font-sans text-xs tracking-[0.24em] text-stone">
          {isCorrect
            ? earnedStar
              ? t("match.foundLabel")
              : t("match.again")
            : t("match.oops")}
        </p>
        <h2 className="mt-2 font-serif text-2xl text-stone">
          {isCorrect
            ? t("match.correctTitle", {
                muralTitle: localized?.title || "",
              })
            : t("match.wrongTitle")}
        </h2>
        <p className="mt-2 font-serif text-sm text-ink/65">
          {isCorrect
            ? earnedStar
              ? t("match.correctBody")
              : t("match.correctBodyRepeat")
            : t("match.wrongBody")}
        </p>

        {isCorrect && localized && (
          <div className="mt-5 border-t border-stone/15 pt-4 text-left">
            <p className="font-serif text-base text-stone">{localized.title}</p>
            <p className="mt-1 font-sans text-[11px] text-stone/60">
              {localized.templeName}
              {localized.location ? ` · ${localized.location}` : ""}
              {localized.period ? ` · ${localized.period}` : ""}
            </p>
            {localized.description && (
              <p className="mt-3 font-serif text-sm leading-relaxed text-ink/70">
                {localized.description}
              </p>
            )}
          </div>
        )}

        {isCorrect ? (
          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={onLearnMore}
              className="min-h-11 bg-cinnabar px-6 py-3 font-serif text-sm text-rice transition-colors hover:bg-[#7a2e28] focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar focus-visible:ring-offset-2 focus-visible:ring-offset-rice"
            >
              {t("match.viewMural")}
            </button>
            <button
              type="button"
              onClick={onChooseAnother}
              className="min-h-11 border border-stone/25 px-6 py-3 font-serif text-sm text-stone transition-colors hover:border-stone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              {t("match.chooseAnother")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-7 min-h-11 border border-stone/25 px-6 py-2.5 font-serif text-sm text-stone transition-colors hover:border-stone/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
          >
            {t("match.keepLooking")}
          </button>
        )}
      </div>
    </div>
  );
}
