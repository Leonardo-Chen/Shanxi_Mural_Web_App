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
  revealAnswer?: boolean;
}

export default function MatchingFeedback({
  result,
  earnedStar,
  mural,
  onDismiss,
  onLearnMore,
  onChooseAnother,
  revealAnswer = false,
}: MatchingFeedbackProps) {
  const { locale, t } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const isCorrect = result === "correct";
  const localized = mural ? locMural(locale, mural) : null;
  const lang = locale === "zh" ? "zh-CN" : locale === "it" ? "it" : "en";

  useEffect(() => {
    cardRef.current?.focus();
  }, [result]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/25 px-4"
      role="presentation"
      onClick={isCorrect ? undefined : onDismiss}
    >
      <div
        ref={cardRef}
        role={isCorrect ? "dialog" : "status"}
        aria-modal={isCorrect ? true : undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="relative w-[calc(100vw-32px)] max-w-[400px] rounded-2xl border border-ink/12 bg-rice px-6 py-6 text-center shadow-[0_18px_40px_rgb(33_51_56_/_18%)] md:w-[380px] md:px-7 md:py-7"
      >
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t("nav.close")}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-rice text-ink/60 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.2 2.2 9.8 9.8M9.8 2.2 2.2 9.8"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p
          className={`type-meta text-center ${
            isCorrect ? "text-gold" : "text-cinnabar"
          }`}
        >
          {isCorrect
            ? earnedStar
              ? t("match.foundLabel")
              : t("match.again")
            : t("match.oops")}
        </p>
        <h2 lang={lang} className="type-page mt-2 text-center">
          {isCorrect
            ? t("match.correctTitle", {
                muralTitle: localized?.title || "",
              })
            : t("match.wrongTitle")}
        </h2>
        <p lang={lang} className="type-body mt-3 text-center text-ink/80">
          {isCorrect
            ? earnedStar
              ? t("match.correctBody")
              : t("match.correctBodyRepeat")
            : revealAnswer
              ? t("match.wrongBody")
              : t("match.wrongBodyFirst")}
        </p>

        {isCorrect && localized ? (
          <div className="mt-5 border-t border-ink/10 pt-4 text-center">
            <p lang={lang} className="type-card">
              {localized.title}
            </p>
            <p className="type-meta mt-2 text-gold">
              {localized.templeName}
              {localized.location ? ` · ${localized.location}` : ""}
              {localized.period ? ` · ${localized.period}` : ""}
            </p>
            {localized.description ? (
              <p lang={lang} className="type-body mt-3 text-ink/75">
                {localized.description}
              </p>
            ) : null}
          </div>
        ) : null}

        {isCorrect ? (
          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={onChooseAnother}
              className="type-ui inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full border border-ink/15 bg-rice px-4 text-ink/70 transition-colors hover:border-cinnabar/35 hover:text-cinnabar focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar"
            >
              {t("match.chooseAnother")}
            </button>
            <button
              type="button"
              onClick={onLearnMore}
              className="type-ui inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-full bg-cinnabar px-4 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
            >
              {t("match.viewMural")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onDismiss}
            className="type-ui mt-6 inline-flex h-11 w-full items-center justify-center rounded-full bg-cinnabar px-4 text-on-accent transition-[filter,transform] duration-200 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-cinnabar active:scale-[0.98]"
          >
            {t(revealAnswer ? "match.keepLooking" : "match.tryAgain")}
          </button>
        )}
      </div>
    </div>
  );
}
